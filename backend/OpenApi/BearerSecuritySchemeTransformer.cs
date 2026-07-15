using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace backend.OpenApi
{
    internal sealed class BearerSecuritySchemeTransformer
        : IOpenApiDocumentTransformer
    {
        private readonly IAuthenticationSchemeProvider
            _authenticationSchemeProvider;

        public BearerSecuritySchemeTransformer(
            IAuthenticationSchemeProvider authenticationSchemeProvider
        )
        {
            _authenticationSchemeProvider =
                authenticationSchemeProvider;
        }

        public async Task TransformAsync(
            OpenApiDocument document,
            OpenApiDocumentTransformerContext context,
            CancellationToken cancellationToken
        )
        {
            IEnumerable<AuthenticationScheme>
                authenticationSchemes =
                    await _authenticationSchemeProvider
                        .GetAllSchemesAsync();

            bool hasBearerScheme = authenticationSchemes.Any(
                authenticationScheme =>
                    authenticationScheme.Name == "Bearer"
            );

            if (!hasBearerScheme)
            {
                return;
            }

            Dictionary<string, IOpenApiSecurityScheme>
                securitySchemes = new()
                {
                    ["Bearer"] = new OpenApiSecurityScheme
                    {
                        Type = SecuritySchemeType.Http,
                        Scheme = "bearer",
                        In = ParameterLocation.Header,
                        BearerFormat = "JWT"
                    }
                };

            document.Components ??= new OpenApiComponents();

            document.Components.SecuritySchemes =
                securitySchemes;
        }
    }
}