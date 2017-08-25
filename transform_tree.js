//scr-scr-scratch!!!

var sampleStats1 = [
    {name:"adm/a1.asp", loc:12, inc:["inc1.asp", "inc2.asp", "adm/inc3.asp"]},
    {name:"inc1.asp", loc:12, inc:["adm/inc3.asp"]},
    {name:"inc2.asp", loc:12, inc:[]},
    {name:"adm/inc3.asp", loc:12, inc:[]},

];

var expectedTree = [
    {
        name:"adm/a1.asp",
        inc:[
            {
                name : "inc1.asp",
                inc:[
                    {
                        name : "adm/inc3.asp",
                        inc:[]
                    }
                ]
            },
            {
                name : "inc2.asp",
                inc:[]
            },
            {
                name : "adm/inc3.asp",
                inc:[]
            }
        ]
    },
    {
        name : "inc1.asp",
        inc:[
            {
                name : "adm/inc3.asp",
                inc:[]
            }
        ]
    },
    {
        name : "inc2.asp",
        inc:[]
    },
    {
        name : "adm/inc3.asp",
        inc:[]
    }
];


var treeCache = {}
var actualTree;

function buildTree(topDeps)
{
    var tree = topDeps.map(buildIndividualTree);
    actualTree = tree;
}

function buildIndividualTree(fileStat,i,depsArr)
{
    if ( treeCache.hasOwnProperty(fileStat.name) ){
        return treeCache[fileStat.name];
    }
    var obj = {
        name:fileStat.name,
        inc:fileStat.inc
    }
    if (fileStat.inc.length != 0){
        //build out obj
        obj.inc = fileStat.inc.map(
            function(incName){
                var stat = lookupStats(incName);
                return buildIndividualTree(stat);
            }
        );
    }
    treeCache[fileStat.name] = obj;
    return obj;

}

function lookupStats(fileName) {
    var stats =  sampleStats1.find(x=>x.name == fileName)
    return stats;
}

buildTree(sampleStats1)
var expectedString = JSON.stringify(expectedTree);
var actualString = JSON.stringify(actualTree);
console.log(expectedString)
console.log(actualString)
console.log(expectedString == actualString);