var elementTools = require("../util/elementTools")();
var filterTools = require("../util/filterTools")();

module.exports = function (){
  
  var filter = {},
    nodes,
    properties,
    enabled = true,
    filteredNodes,
    filteredProperties;
  
  var importantNodes = ["flood", "coastal flood"]
  
  /**
   * If enabled, all datatypes and literals including connected properties are filtered.
   * @param untouchedNodes
   * @param untouchedProperties
   */
  filter.filter = function ( untouchedNodes, untouchedProperties ){
    nodes = untouchedNodes;
    properties = untouchedProperties;
    
    if ( this.enabled() ) {
        removeDatatypesAndLiterals();
    }
    
    filteredNodes = nodes;
    filteredProperties = properties;
  };

    /**
   * If enabled, the handler will add all of the linked nodes to the importantNodes set
   * @param selection
   * @param forced
   */
  filter.handle = function( selection, forced ) {
    if(!enabled) {
      return;
    }

    if(!forced) {
      if(wasNotDragged()) {
        return;
      }
    }
    if(elementTools.isNode(selection)) {
      nodeLinks = selection.links();
      alert("Clicked: " + selection.labelForCurrentLanguage());
      // var propValue;
      // for(var nodeLink in nodeLinks) {
      //     propValue = nodeLinks[nodeLink]

      //     alert(JSON.stringify(getMethods(propValue.label()).join("\n")));
      //     // alert(JSON.stringify(propValue.label().applyFixedLocationAttributes()));

      // }
      // // for(link in nodeLinks) {
      //   alert(JSON.stringify(link)
      // }
      // alert(JSON.stringify(nodeLinks[0].range()));
      // alert(JSON.stringify(nodeLinks[1].range()));
      // alert(JSON.stringify(nodeLinks[2].range()));
      // alert(JSON.stringify(nodeLinks[3].range()));

      // alert(JSON.stringify(nodeLinks.nodes()));


      // alert(JSON.stringify(nodeLinks.count);
      // if()
      // for(i = 0; i < nodeLinks.length; i++) {
      //   // lg = nodeLinks[i].pathObj();
      //   // pathLen = Math.floor(lg.node().getTotalLength());
      //   // node1 = lg.node().getPointAtLength(pathLen - 4);
      //   // node2 = lg.node().getPointAtLength(pathLen)
      //   // alert(node1.labelForCurrentLanguage());
      //   // alert(node2.labelForCurrentLanguage());
      //   // alert(JSON.stringify(nodeLinks[i].range()));

      //   // alert(JSON.stringify(nodeLinks[i].property().labelForCurrentLanguage()));
      // }
    }
  }
  

  function getMethods(obj) {
    var result = [];
    for (var id in obj) {
      try {
        if (typeof(obj[id]) == "function") {
          result.push(id + ": " + obj[id].toString());
        }
      } catch (err) {
        result.push(id + ": inaccessible");
      }
    }
    return result;
  }
  function removeDatatypesAndLiterals(){
    var filteredData = filterTools.filterNodesAndTidy(nodes, properties, isImportantNode);
    
    nodes = filteredData.nodes;
    properties = filteredData.properties;
  }
  
  function isImportantNode( node ){

    var isImportant = false;
    //find out if the node is important
    for(i = 0; i < importantNodes.length; i++) {
      if(node.labelForCurrentLanguage() == importantNodes[i]) {
        isImportant = true;
      } 
    }

    return isImportant;
  }
  
  filter.enabled = function ( p ){
    if ( !arguments.length ) return enabled;
    enabled = p;
    return filter;
  };
  
  
  // Functions a filter must have
  filter.filteredNodes = function (){
    return filteredNodes;
  };
  
  filter.filteredProperties = function (){
    return filteredProperties;
  };
  
  
  return filter;
};
