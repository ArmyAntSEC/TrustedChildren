const apiUtils = require('../../../src/utils/apiUtilities.js');


describe('Test verifyProperMethod', function () {
    it('should accept the correct one', async () => {
        function verifyError() {
            const event = { httpMethod: "GET" };
            const method = "GET";
            apiUtils.verifyProperMethod(event, method)
        }
        expect(verifyError).not.toThrowError()
    });

    it('should not accept the wrong one', async () => {
        function verifyError() {
            const event = { httpMethod: "GET" };
            const method = "POST";
            apiUtils.verifyProperMethod(event, method)
        }

        expect(verifyError).toThrow(new apiUtils.ErrorResponse(405, "Method not allowed"))
    });

    describe('Test handlerWrapper', function () {
        it('should responsProperly On Success', async () => {
            process.env.HASHED_API_KEY = "ba2ef371838b7644589abb2e43876a11670891758a4cdd801225490d17e7f870";
            const handler = function (event) { return { "key": "value" } }
            const event = { headers: { 'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD" } };

            const response = await apiUtils.handlerWrapper(event, handler);

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual(JSON.stringify({ "key": "value" }));
        });

        it('should responsProperly On Empty Data', async () => {
            process.env.HASHED_API_KEY = "ba2ef371838b7644589abb2e43876a11670891758a4cdd801225490d17e7f870";
            const handler = function (event) { return null }
            const event = { headers: { 'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD" } };

            const response = await apiUtils.handlerWrapper(event, handler);

            expect(response.statusCode).toEqual(204);
            expect(response.body).toEqual("");
        });

        it('should responsProperly On Expected Failure', async () => {
            process.env.HASHED_API_KEY = "ba2ef371838b7644589abb2e43876a11670891758a4cdd801225490d17e7f870";
            const handler = function (event) { throw new apiUtils.ErrorResponse(404, "Error") }
            const event = { headers: { 'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD" } };

            const response = await apiUtils.handlerWrapper(event, handler);

            expect(response.statusCode).toEqual(404);
            expect(response.body).toEqual("Error");
        });

        it('should responsProperly On Unxpected Failure', async () => {
            process.env.HASHED_API_KEY = "ba2ef371838b7644589abb2e43876a11670891758a4cdd801225490d17e7f870";
            const handler = function (event) { throw new Error("Error") }
            const event = { headers: { 'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD" } };

            const response = await apiUtils.handlerWrapper(event, handler);

            expect(response.statusCode).toEqual(500);
            expect(response.body).toEqual("Internal Server Error");
        });

    })

})