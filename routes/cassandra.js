const cassandra = require('cassandra-driver');
var express = require('express');
var router = express.Router();

const client = new cassandra.Client({
  contactPoints: ['44.202.65.55'],
  localDataCenter: 'us-east',
  keyspace: 'SampledPoints'
});

const readData = async (res, query) => {
  return new Promise((resolve, reject) =>
  {
    console.log(Date.now());
    try {
        client.stream(query, [], { fetchSize : 50000 }) 
        .on('readable', function () {
            // 'readable' is emitted as soon a row is received and parsed
            let row;
            while (row = this.read()) {
                //console.log('Count %s and value %s', count, row.x);
                res.write(JSON.stringify(row) +"\n");
            }
        })
        .on('end', function () {
            console.log(Date.now());
            // Stream ended, there aren't any more rows
            res.end();
            resolve(true);
        })
        .on('error', function (err) {
            // Something went wrong: err is a response error from Cassandra
            res.end();
            reject(false);
        });
    } catch(e) {
        res.end();
    }
  });
}

const findData = async (res, query, filter) => {

  return new Promise((resolve, reject) =>
  {
    try {
        client.stream(query, 
          [
            Number(Number(filter.xmin).toFixed(2)), 
            Number(Number(filter.xmax).toFixed(2))
          ], 
          { 
            fetchSize : 5000, 
            prepare: true 
          }) 
        .on('readable', function () {
            // 'readable' is emitted as soon a row is received and parsed
            let row;
            while (row = this.read()) {

                if (row.y >= filter.ymin && row.y <= filter.ymax) {
                  res.write(JSON.stringify(row) +"\n");
                }
            }
        })
        .on('end', function () {
            // Stream ended, there aren't any more rows
            res.end();
            resolve(true);
        })
        .on('error', function (err) {
            // Something went wrong: err is a response error from Cassandra
            console.log("Error" + Error);
            res.end();
            reject(false);
        });
    } catch(e) {
        res.end();
    }
  });
}

const classCount = async (res, query, filter) => {
  
  return new Promise((resolve, reject) =>
  {
    try {
        
        client.stream(query, 
          [
            Number(Number(filter.xmin).toFixed(2)), 
            Number(Number(filter.xmax).toFixed(2))
          ], 
          { 
            fetchSize : 5000, 
            prepare: true 
          }) 
        .on('readable', function () {
            // 'readable' is emitted as soon a row is received and parsed
            let row;
            let classCounts = [0,0,0,0,0,0,0,0];
            while (row = this.read()) {

                if (row.y >= filter.ymin && row.y <= filter.ymax) {
                  if (row.c > 0)
                  {
                    classCounts[row.c - 1] = classCounts[row.c - 1] + 1;  
                  }
                }
            }

            res.write(JSON.stringify({classCount : classCounts})+"\n");
        })
        .on('end', function () {
            // Stream ended, there aren't any more rows]
            res.end();
            resolve(true);
        })
        .on('error', function (err) {
            // Something went wrong: err is a response error from Cassandra
            console.log("Error" + Error);
            res.end();
            reject(false);
        });
    } catch(e) {
        res.end();
    }
  });
}

const clcscp = async (res, query, filter) => {
  
  return new Promise((resolve, reject) =>
  {
    try {
        
        client.stream(query, 
          [
            Number(Number(filter.xmin).toFixed(2)), 
            Number(Number(filter.xmax).toFixed(2))
          ], 
          { 
            fetchSize : 5000, 
            prepare: true 
          }) 
        .on('readable', function () {
            // 'readable' is emitted as soon a row is received and parsed
            let row;
            let final = [0, 0 ,0];
            while (row = this.read()) {

                if (row.y >= filter.ymin && row.y <= filter.ymax) {
                  if (row.c > 0)
                  {
                    classCounts[row.c - 1] = classCounts[row.c - 1] + 1;  
                  }
                }
            }

            res.write(JSON.stringify({classCount : classCounts})+"\n");
        })
        .on('end', function () {
            // Stream ended, there aren't any more rows]
            res.end();
            resolve(true);
        })
        .on('error', function (err) {
            // Something went wrong: err is a response error from Cassandra
            console.log("Error" + Error);
            res.end();
            reject(false);
        });
    } catch(e) {
        res.end();
    }
  });
}

router.get('/subsample', function(req, res, next) 
{
    const query = 'SELECT X, Y, Z, C FROM points WHERE tileid = 1';

    readData(res, query)
    .then(r => {
        console.log("DONE")
    })
    .catch(e => {
        console.log("Error", e);
    });
});

router.get('/classify', function(req, res, next) 
{
    const xmin  = req.query.xmin;
    const xmax  = req.query.xmax;
    const ymin  = req.query.ymin;
    const ymax  = req.query.ymax;
    const xmean = req.query.xmean;
    const ymean = req.query.ymean;
    const zmean = req.query.zmean;

    const filter = {
      xmin  : Number(xmin) + Number(xmean),
      xmax  : Number(xmax) + Number(xmean),
      ymin  : Number(ymin) + Number(ymean),
      ymax  : Number(ymax) + Number(ymean),
      xmean : Number(xmean),
      ymean : Number(ymean),
      zmean : Number(zmean)
    };

    const query = 'SELECT x, y, z, c FROM points WHERE tileid = 1 AND x >= ? AND x <= ?';

    findData(res, query, filter)
    .then(r => {
        console.log("DONE")
    })
    .catch(e => {
        console.log("Error", e);
    });
});

router.get('/classcount', function(req, res, next) 
{
    const xmin  = req.query.xmin;
    const xmax  = req.query.xmax;
    const ymin  = req.query.ymin;
    const ymax  = req.query.ymax;
    const xmean = req.query.xmean;
    const ymean = req.query.ymean;
    const zmean = req.query.zmean;

    const filter = {
      xmin  : Number(xmin) + Number(xmean),
      xmax  : Number(xmax) + Number(xmean),
      ymin  : Number(ymin) + Number(ymean),
      ymax  : Number(ymax) + Number(ymean),
      xmean : Number(xmean),
      ymean : Number(ymean),
      zmean : Number(zmean)
    };
    console.log("CLASSCOUNT API : WORKING...............................");
    const query = 'SELECT x, y, z, c FROM points WHERE tileid = 1 AND x >= ? AND x <= ?';

    classCount(res, query, filter)
    .then(r => {
        console.log("DONE")
    })
    .catch(e => {
        console.log("Error", e);
    });
});

module.exports = router;