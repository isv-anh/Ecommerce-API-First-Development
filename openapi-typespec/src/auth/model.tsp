import "../common/model.tsp";

using Common;

@example(#{ username: "john_doe", password: "StrongP@ss123" })
model SigninRequest {
    username: string;
    password: string;
}

model SigninModel {
    accessToken: string;
    refreshToken: string;
}

@example(#{
    username: "john_doe",
    email: "john@example.com",
    password: "StrongP@ss123",
    reTypePassword: "StrongP@ss123",
    phoneNumber: "0123456789",
    name: "John Doe",
})
model SignupRequest {
    username: string;

    @pattern("^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$")
    email: string;

    @pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$")
    password: string;

    reTypePassword: string;

    @pattern("^0\\d{9}$")
    phoneNumber: string;

    name: string;
}

@example(#{
    message: "successfully",
    data: #{
        accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc1MjkwNjkzOSwiZXhwIjoxNzUyOTEwNTM5fQ.Rxq_lbQtx8DKLJwqwyVqqb03MsfG54h2uNKooeM79JE",
        refreshToken: "eyJhbGciOiJIUzI1NiJ9",
    },
})
model SigninResponse extends Response<SigninModel> {}
model SignupResponse extends Response<SigninModel> {}
