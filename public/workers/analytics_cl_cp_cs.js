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
        fetch(`/users/clcpcs?`
            +`xmin=`  + xmin
            +`&xmax=` + xmax
            +`&ymin=` + ymin
            +`&ymax=` + ymax
            +`&xmean=`+ xmean
            +`&ymean=`+ ymean
            +`&zmean=`+ zmean
        )
        .then(response => response.json())
        .then(data =>
        {   
            postMessage(data.clcpcs);
        })
        .catch(e => console.log(e));
    }
} 
else 
{
    // Sorry! No Web Worker support..
}  