const axios = require('axios');
var express = require('express');
var app = express();

// an array of metrics to filter out
// can also be done in prometheus
const ignoreMetrics = [
]

app.get('/metrics', function (req, res) {
  axios.get('http://localhost:9080/metrics')
    .then(response => {
      const metrics = response.data.split("\n");
      const prunedMetrics = [];
      metrics.forEach((metric) => {
        let skip = false;
        ignoreMetrics.forEach((ignore) => {
          if (metric.includes(ignore)) {
            skip = true;
          }
        });

        if (skip) {
          return;
        }

        // replace not split so comments are perserved
        prunedMetrics.push(metric.replace("base:", "").replace("vendor:", ""));
      });
      res.send(prunedMetrics.join("\n"));
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.listen(8080, function () {
  console.log('listening on port 8080.');
});
