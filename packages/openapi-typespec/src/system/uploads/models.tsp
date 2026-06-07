model PostPresignedUrl {
    fileName: string;
    contentType: string;
}

model PostPresignedUrlResponse {
    uploadUrl: string;
    fileUrl: string;
    fields: unknown;
    key: string;
}

model PostPresignedUrlBody {
    @maxItems(10)
    files: PostPresignedUrl[];
}

model PostPresignedUrl200Response {
    uploads: PostPresignedUrlResponse[];
}
