var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
},
width = 840,
    height = 600;
var kx = function (d) {
    return d.x - 20;
};
var ky = function (d) {
    return d.y - 10;
};
//thie place the text x axis adjust this to center align the text
var tx = function (d) {
    return d.x - 3;
};
//thie place the text y axis adjust this to center align the text
var ty = function (d) {
    return d.y + 3;
};
//make an SVG
var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




//My JSON note the 
//no_parent: true this ensures that the node will not be linked to its parent
//hidden: true ensures that the nodes is not visible.
var root = {
    name: "",
    id: 1,
    // hidden: false,
    children: [ 
        {
            name: "Christine Halfpenny",
            id: 2,
            no_parent: true,
        },
        {
            name: "",
            id: 10,
            no_parent: true,
            hidden: true,
            children: [
                {
                    name: "Lucas Halfpenny",
                    id: 4
                },
                {
                    name: "Samuel Halfpenny",
                    id: 5
                },

            ]
        },
        {
            name: "Deane Halfpenny",
            id: 3,
            no_parent: true,
        }
    ]
}

var allNodes = flatten(root);
//This maps the partnership together mapping uses the ID using the blue line
var partnerships = [
    {
        source: {
            id: 2,
            // name: "Christine Halfpenny"
        },
        target: {
            id: 3,
            // name: "Deane Halfpenny"
        }
    }
    // {
//     source: {
//         id: 3,
//         name: "C"
//     },
//     target: {
//         id: 11,
//         name: "K"
//     }
// }, {
//     source: {
//         id: 12,
//         name: "L"
//     },
//     target: {
//         id: 13,
//         name: "J"
//     }
// }, {
//     source: {
//         id: 5,
//         name: "D"
//     },
//     target: {
//         id: 6,
//         name: "E"
//     }
// }, 
// {
//     source: {
//         id: 16,
//         name: "Q"
//     },
//     target: {
//         id: 10,
//         name: "M"
//     }
// }
];

// Compute the layout.
var tree = d3.layout.tree().size([width, height]),
    nodes = tree.nodes(root),
    links = tree.links(nodes);

// Create the link lines.
svg.selectAll(".link")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", elbow);


var nodes = svg.selectAll(".node")
    .data(nodes)
    .enter();

//First draw partnerships line with blue line
svg.selectAll(".partnerships")
    .data(partnerships)
    .enter().append("path")
    .attr("class", "partner")
    .attr("d", partnerLine);

// Create the node rectangles.
nodes.append("rect")
    .attr("class", "node")
    .attr("height", 20)
    .attr("width", 40)
    .attr("id", function (d) {
    return d.id;
})
    .attr("display", function (d) {
    if (d.hidden) {
        return "none"
    } else {
        return ""
    };
})
    .attr("x", kx)
    .attr("y", ky);
// Create the node text label.
nodes.append("text")
.text(function (d) {
    return d.name;
})
.attr("x", tx)
.attr("y", ty)
.style("cursor", "pointer") // Add pointer cursor to indicate clickable
.on("click", function(d) {
    if (d.url) {
        window.location.href = d.url; // Navigate to the specified URL
    }
});


/**
This defines teh line between partnerships.
**/
function partnerLine(d, i) {
    var start = allNodes.find(function (v) {
        return d.source.id == v.id;
    });

    var end = allNodes.find(function (v) {
        return d.target.id == v.id;
    });

    // If start or end node is not found, return an empty line
    if (!start || !end) {
        return "M0,0L0,0";
    }

    var linedata = [{
        x: start.x,
        y: start.y
    }, {
        x: end.x,
        y: end.y
    }];

    var lineFunction = d3.svg.line()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; })
        .interpolate("linear");

    return lineFunction(linedata);
}

/*To make the nodes in flat mode.
This gets all teh nodes in same level*/
function flatten(root) {
    var n = [],
        i = 0;

    function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        n.push(node);
    }
    recurse(root);
    return n;
}
/** 
This draws the lines between nodes.
**/
function elbow(d, i) {
    if (d.target.no_parent) {
        return "M0,0L0,0";
    }
    var diff = d.source.y - d.target.y;
    //0.40 defines the point from where you need the line to break out change is as per your choice.
    var ny = d.target.y + diff * 0.40;

    linedata = [{
        x: d.target.x,
        y: d.target.y
    }, {
        x: d.target.x,
        y: ny
    }, {
        x: d.source.x,
        y: d.source.y
    }]

    var fun = d3.svg.line().x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    }).interpolate("step-after");
    return fun(linedata);
}