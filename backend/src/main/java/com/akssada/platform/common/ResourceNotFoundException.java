package com.akssada.platform.common;

/**
 * Thrown when a requested resource (by slug, id, etc.) does not exist or is
 * not publicly visible. Mapped to HTTP 404 by {@link ApiExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
