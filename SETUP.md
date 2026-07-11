# Cài Đặt

### 0. Khởi động Terminal

Nhấp chuột phải vào menu Start và chọn "Terminal."
※ Bạn KHÔNG cần chạy với quyền quản trị viên.
※ Đối với Windows 10, chọn "PowerShell."

### 1. Chuẩn Bị Môi Trường Windows

```powershell
winget install --id Microsoft.Powershell --source winget
winget install --id Microsoft.Powershell.Preview --source winget
winget install Postman.Postman
winget install -e --id Microsoft.VisualStudioCode
# end
```

> ⚠️ **Lưu ý**
>
> - VSCode sẽ bị đóng bắt buộc, vì vậy hãy đóng nó trước khi chạy các lệnh này.
> - Các lệnh sau sẽ tự động mở nhiều cửa sổ VSCode; chỉ cần chờ, VSCode sẽ tự đóng sau khi cài đặt xong.

```powershell
code --profile "e-commerce"
code --profile "e-commerce-front"
code --profile "e-commerce-api"

# cài đặt wsl extension
code --profile "Default" --install-extension ms-vscode-remote.remote-wsl
code --profile "e-commerce" --install-extension ms-vscode-remote.remote-wsl
code --profile "e-commerce-front" --install-extension ms-vscode-remote.remote-wsl
code --profile "e-commerce-api" --install-extension ms-vscode-remote.remote-wsl

# thoát vscode
Stop-Process -Name code -Force
# end
```

```powershell
$shortcutFolder = "$env:USERPROFILE\Desktop\e-commerce"

if (!(Test-Path -Path $shortcutFolder)) {
    New-Item -Path $shortcutFolder -ItemType Directory
}

$shortcuts = @(
    @{ Name = "e-commerce.lnk"; Arguments = "/c wsl code ~/e-commerce/e-commerce.code-workspace --profile e-commerce" },
    @{ Name = "e-commerce-front.lnk"; Arguments = "/c wsl code ~/e-commerce/packages/e-commerce-front/e-commerce-front.code-workspace --profile e-commerce-front" },
    @{ Name = "e-commerce-api.lnk"; Arguments = "/c wsl code ~/e-commerce/packages/e-commerce-api/e-commerce-api.code-workspace --profile e-commerce-api" }
)

foreach ($shortcut in $shortcuts) {
    $shortcutPath = "$shortcutFolder\$($shortcut.Name)"
    $WScriptShell = New-Object -ComObject WScript.Shell
    $sc = $WScriptShell.CreateShortcut($shortcutPath)
    $sc.TargetPath = "C:\Windows\System32\cmd.exe"
    $sc.Arguments = $shortcut.Arguments
    $sc.Save()
}
# end
```

##### Ghi chú

Các công cụ sẽ được cài đặt:

- **Postman**: Công cụ kiểm thử API
- **Visual Studio Code**: IDE

---

## 2. Cài Đặt WSL

### 0. Nếu Bạn Đã Cài WSL Trước Đây

> ⚠️ **Lưu ý**
>
> - Lệnh sau sẽ xóa WSL.
> - Nếu bạn có dữ liệu trong WSL, hãy sao lưu trước.

```powershell
wsl --unregister [distro-name]
```

Bỏ qua đến "3. Cập nhật WSL & Cài đặt mạng WSL"

### 1. Cài Đặt WSL

```powershell
wsl --install Ubuntu-24.04
```

### 2. Khởi Động Lại PC

Nếu terminal không yêu cầu khởi động lại, bạn có thể bỏ qua bước này.

```powershell
Restart-Computer
```

### 3. Cập Nhật WSL & Cài Đặt Mạng WSL

Nếu bạn đã tạo `.wslconfig` (và không muốn ghi đè), hãy thêm nội dung sau theo cách thủ công.

```powershell
wsl --set-default Ubuntu-24.04
wsl --update
```

```powershell
$wslConfigPath = "$env:USERPROFILE\.wslconfig"

$wslConfigContent = @"
[wsl2]
dnsTunneling=true
"@

$wslConfigContent | Out-File -FilePath $wslConfigPath -Encoding utf8
```

### 4. Khởi Động WSL

```powershell
wsl
```

Bạn sẽ được yêu cầu nhập tên người dùng và mật khẩu. Vui lòng thiết lập như sau:

| Tên người dùng | Mật khẩu |
| -------------- | -------- |
| pengu          | (Tùy ý)  |

### 5. Thiết Lập WSL

Khi được yêu cầu nhập mật khẩu, hãy nhập mật khẩu bạn đã đặt ở "4. Khởi động WSL"

```bash
sudo tee /etc/wsl.conf > /dev/null <<EOF
[boot]
systemd=true
EOF
```

### 6. Khởi Động Lại WSL & Kiểm Tra Kết Nối

```bash
exit
```

```powershell
wsl --shutdown
wsl
```

---

## 3. Cài Đặt Linux

### 1. Cài Đặt Các Công Cụ

```bash
cd

sudo apt update
sudo apt upgrade -y
sudo apt install git -y
# github cli https://github.com/cli/cli/blob/trunk/docs/install_linux.md#debian
(type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
	&& sudo mkdir -p -m 755 /etc/apt/keyrings \
	&& out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
	&& cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
	&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
	&& sudo mkdir -p -m 755 /etc/apt/sources.list.d \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
	&& sudo apt update \
	&& sudo apt install gh -y
# github auth
sudo apt install wslu -y
# setup script
sudo apt install ansible -y
# vscode extensions auto install
sudo apt install jq -y
```

### 2. Tạo SSH Key

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github -N ""
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/github
cat << EOF > ~/.ssh/config
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github
EOF
chmod 600 ~/.ssh/config
```

### 3. Đăng Nhập GitHub

```bash
export BROWSER="/mnt/c/Windows/System32/cmd.exe /c start"
gh auth login --web -s admin:public_key,project,repo,read:org --git-protocol ssh
```

- `? Upload your SSH public key to your GitHub account?`
  - Chỉ cần nhấn Enter: `/home/pengu/.ssh/github.pub` sẽ được sử dụng.
- `? Title for your SSH key`
  - Chỉ cần nhấn Enter: `GitHub CLI` sẽ được sử dụng.
- `Press Enter to open github.com in your browser...`
  - Nhấn Enter và trình duyệt sẽ mở ra.
  - Sao chép **Mã Onetime** trong terminal của bạn.
  - Dán vào và đăng nhập vào GitHub.

### 4. Clone Repository

```bash
cd
mkdir e-commerce
cd e-commerce
```

```bash
git clone git@github.com:ndh-anh/e-commerce.git .
```

- `Are you sure you want to continue connecting (yes/no/[fingerprint])?`
  - Nhập `yes`

### 5. Khởi Động VSCode

Nhấp đúp vào shortcut trong thư mục `e-commerce` đã tạo trên Desktop để khởi động VSCode.

Nếu được yêu cầu tin tưởng workspace, chọn **"Trust."**

> ⚠️ **Lưu ý**
>
> - Luôn khởi động VSCode từ shortcut. Cài đặt workspace và profile khác nhau, khởi động theo cách khác có thể gây ra lỗi.
> - Nếu shortcut không hoạt động sau khi xây dựng lại WSL, hãy tạo lại shortcut.

### 6. Thiết Lập Tự Động

Từ menu **Task** của VSCode, chạy `Setup environment`.

Trong quá trình cài đặt, script sẽ yêu cầu các giá trị sau:

- `Please enter POSTGRES_USER:`
  - Nhập tên superuser của PostgreSQL.
  - Ví dụ: `postgres`

- `Enter POSTGRES_PASSWORD:`
  - Nhập mật khẩu cho superuser PostgreSQL.

- `Nhập ADMIN_PASSWORD:`
  - Nhập mật khẩu cho tài khoản admin mặc định.
  - Tài khoản admin mặc định:
    - Username: `admin`
    - Email: `admin@example.com`

- `Please enter POSTGRES_DB:`
  - Nhập tên cơ sở dữ liệu.
  - Ví dụ: `e-commerce_db`

- `Please enter POSTGRES_PORT (default: 5432):`
  - Nhấn Enter để sử dụng cổng mặc định.

- `BECOME password:`
  - Nhập mật khẩu bạn đã tạo ở [4. Khởi động WSL](#4-khởi-động-wsl).
