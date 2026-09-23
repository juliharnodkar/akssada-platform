package com.akssada.platform.common;

import java.time.OffsetDateTime;
import java.util.Map;

/**
 * Uniform error body returned by the API. Never exposes stack traces.
 */
public record ApiError(
        OffsetDateTime timestamp,
        int status,
        String error,
        String message,
        Map<String, String> fieldErrors) {

    public static ApiError of(int status, String error, String message) {
        return new ApiError(OffsetDateTime.now(), status, error, message, null);
    }

    public static ApiError validation(int status, String message, Map<String, String> fieldErrors) {
        return new ApiError(OffsetDateTime.now(), status, "Validation Failed", message, fieldErrors);
    }
}
