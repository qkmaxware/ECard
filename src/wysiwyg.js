wysiwyg = (function(){
    var exports = {};

    exports.action = function(button, event) {
        var command = button.dataset.action;
        var value = button.dataset.value;
        document.execCommand(command, false, value);
    };

    exports.get_html = function() {
        return document.getElementById("editor-content").innerHTML;
    }

    // Helper function to convert the stream data to an array
    async function streamToArray(stream) {
        const chunks = [];
        const reader = stream.getReader();
        let done, value;
        while ({ done, value } = await reader.read()) {
            if (done) break;
            chunks.push(...value);
        }
        return chunks;
    }

    exports.get_compressed_url_safe_html = async function() {
        var str = exports.get_html();

        // Step 1: Convert the string into a Uint8Array (UTF-8 encoded bytes)
        const encoder = new TextEncoder();
        const byteArray = encoder.encode(str);

        // Step 2: Create a CompressionStream with Gzip compression
        const compressedStream = new CompressionStream('gzip');
        const writableStream = compressedStream.writable;
        const writer = writableStream.getWriter();

        // Step 3: Write the data to the writable stream to compress it
        writer.write(byteArray);
        writer.close();

        // Step 4: Collect the compressed data from the stream
        const compressedArray = await streamToArray(compressedStream.readable);

        // Step 5: Encode the compressed data in Base64 URL-safe format
        const base64Encoded = btoa(String.fromCharCode(...compressedArray))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, ''); // Remove padding

        return base64Encoded;
    }

    exports.decode_compressed_url_safe = async function(encodedText) {
        // Step 1: Decode the Base64 URL-safe string back to the compressed form
        const compressedData = new Uint8Array(atob(encodedText
            .replace(/-/g, '+')
            .replace(/_/g, '/'))
            .split('')
            .map(char => char.charCodeAt(0)));

        // Step 2: Create a DecompressionStream for Gzip decompression
        const decompressionStream = new DecompressionStream('gzip');
        const writableStream = decompressionStream.writable;
        const reader = writableStream.getWriter();

        // Step 3: Write the compressed data into the decompression stream
        reader.write(compressedData);
        reader.close();

        // Step 4: Collect the decompressed data
        const decompressedArray = await streamToArray(decompressionStream.readable);

        // Step 5: Decode the decompressed data back into a string
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(decompressedArray));
    }

    return exports;
})();