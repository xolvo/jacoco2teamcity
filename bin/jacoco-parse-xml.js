#!/usr/bin/env node

var fs = require('fs'),
    xml2js = require('xml2js'),
    argv = require('yargs').argv;

var parser = new xml2js.Parser();

var report_path = argv.report;

fs.readFile(report_path, function(err, data) {
    if(err) {
        console.error(err);
        return;
    }

    parser.parseString(data, function (err2, result) {
        if(err2) {
            console.error(err2);
            return;
        }

        for(var i = 0; i < result.report.counter.length; i++) {
            var cnt = result.report.counter[i],
                item = cnt['$'];

            switch(item.type) {
                case 'LINE':
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsLCovered' value='%s']", item.covered);
                    var total = sumStrings(item.covered, item.missed);
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsLTotal' value='%s']", total);
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsLPercentage' value='%s']", item.covered * 1.0 / total);
                break;

                case 'METHOD':
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsMCovered' value='%s']", item.covered);
                    var total = sumStrings(item.covered, item.missed);
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsMTotal' value='%s']", total);
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsMPercentage' value='%s']", item.covered * 1.0 / total);
                break;

                case 'CLASS':
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsCCovered' value='%s']", item.covered);
                    var total = sumStrings(item.covered, item.missed);
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsCTotal' value='%s']", total);
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsMPercentage' value='%s']", item.covered * 1.0 / total);
                break;
            }
        }
    });
});

function sumStrings(str1, str2) {
    return parseInt(str1) + parseInt(str2);
}
