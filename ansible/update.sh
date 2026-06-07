echo "Bắt đầu lúc $(date)" >> /var/log/ecommerce_dev_env_update.log
# Không được chứa prompt vì được chạy tự động định kỳ bởi cron
sudo ansible-playbook ~/e-commerce/setup.yml
echo "Hoàn thành lúc $(date)" >> /var/log/ecommerce_dev_env_update.log