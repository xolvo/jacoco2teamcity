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
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsLTotal' value='%s']", sumStrings(item.covered, item.missed));
                break;

                case 'METHOD':
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsMCovered' value='%s']", item.covered);
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsMTotal' value='%s']", sumStrings(item.covered, item.missed));
                break;

                case 'CLASS':
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsCCovered' value='%s']", item.covered);
                    console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsCTotal' value='%s']", sumStrings(item.covered, item.missed));
                break;
            }
        }
    });
});

function sumStrings(str1, str2) {
    return parseInt(str1) + parseInt(str2);
}
