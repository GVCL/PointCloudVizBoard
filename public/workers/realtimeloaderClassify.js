async function *parseJsonStream(readableStream) {
    for await (const line of readLines(readableStream.getReader())) {
        const trimmedLine = line.trim().replace(/,$/, '');

        if (trimmedLine !== '[' && trimmedLine !== ']') {
            yield JSON.parse(trimmedLine);
        }
    }
}

async function *readLines(reader) {
    const textDecoder = new TextDecoder();
    let partOfLine = '';
    for await (const chunk of readChunks(reader)) {
        const chunkText = textDecoder.decode(chunk);
        const chunkLines = chunkText.split('\n');
        if (chunkLines.length === 1) {
            partOfLine += chunkLines[0];
        } else if (chunkLines.length > 1) {
            yield partOfLine + chunkLines[0];
            for (let i=1; i < chunkLines.length - 1; i++) {
                yield chunkLines[i];
            }
            partOfLine = chunkLines[chunkLines.length - 1];
        }
    }
}

function readChunks(reader) {
    return {
        async* [Symbol.asyncIterator]() {
            let readResult = await reader.read();
            while (!readResult.done) {
                yield readResult.value;
                readResult = await reader.read();
            }
        },
    };
}

if (typeof(Worker) !== "undefined") 
{
    onmessage = function(e) 
    {
        const xmin  = e.data[0];
        const xmax  = e.data[1];
        const ymin  = e.data[2];
        const ymax  = e.data[3];
        const xmean = e.data[4];
        const ymean = e.data[5];
        const zmean = e.data[6];
        loadData(xmin, xmax, ymin, ymax, xmean, ymean, zmean);
    }

    function loadData(xmin, xmax, ymin, ymax, xmean, ymean, zmean)
    {
        var bufferTemp = [];
        var offset = 0

        fetch(`/cassandra/classify?`
        +`xmin=`  + xmin
        +`&xmax=` + xmax
        +`&ymin=` + ymin
        +`&ymax=` + ymax
        +`&xmean=`+ xmean
        +`&ymean=`+ ymean
        +`&zmean=`+ zmean)
        .then(async (response) => {
            let measurementsReceived = 0;
            for await (const data of parseJsonStream(response.body)) {
                measurementsReceived++;
                bufferTemp.push([data.x, data.y, data.z, data.c]);

                if (measurementsReceived % 5000 === 0) {
                    postMessage({buffer : bufferTemp, offset : offset});
                    offset = measurementsReceived;
                    bufferTemp = [];
                }
            }

            if (bufferTemp.length > 0) {
                postMessage({buffer : bufferTemp, offset : offset});
            }
        })
        .catch(e => console.log(e));
    }
} 
else 
{
    // Sorry! No Web Worker support..
}  