import "@typespec/openapi";

using TypeSpec.OpenAPI;

@minLength(1)
scalar NonEmptyString extends string;

@format("email")
@pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
@extension(
    "x-error-message",
    "Email must be a valid email address format (e.g., example@domain.com)"
)
scalar Email extends string;

@doc("Password must be at least 8 chars and include letters and numbers")
@extension(
    "x-error-message",
    "Password must be at least 8 characters long and include both letters and numbers."
)
@pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$") // Minimum 8 characters, at least one letter and one number
scalar Password extends NonEmptyString;

@pattern("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")
scalar UUID extends NonEmptyString;
