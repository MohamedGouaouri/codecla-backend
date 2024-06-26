export class ServiceResponseSuccess {
    constructor(
        data,
        resourceCreated = false,
    ) {
        this.data = data;
        this.resourceCreated = resourceCreated
    }
    getHttpResponse() {
        return {
            status: 'success',
            data: this.data,
        }
    }
    getHttpStatus() {
        return this.resourceCreated ? 201 : 200;
    }
}

export class ServiceResponseFailure {
    constructor(
        error,
    ) {
        this.error = error;
    }
    getHttpResponse() {
        return {
            status: 'error',
            message: this.error.getMessage(),
            error: this.error.name,
        }
    }
    getHttpStatus() {
        return this.error.getHttpCode() || 500;
    }
}