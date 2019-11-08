var elementTools = require("../util/elementTools")();
var filterTools = require("../util/filterTools")();

module.exports = function (){
  
  var filter = {},
    nodes,
    properties,
    enabled = true,
    filteredNodes,
    filteredProperties;
  
  var unfilteredNodes, unfilteredProperties;
  //considering "flash foods" and "flash flooding" as important nodes for now
  var importantNodes = ["232", "105"];
  var timesFiltered = 1;
  
  /**
   * If enabled, all datatypes and literals including connected properties are filtered.
   * @param untouchedNodes
   * @param untouchedProperties
   */
  filter.filter = function ( untouchedNodes, untouchedProperties ){
    nodes = untouchedNodes;
    properties = untouchedProperties;

    if(timesFiltered <= 1) {
      unfilteredNodes = untouchedNodes;
      unfilteredProperties = untouchedProperties;
    }

    //increase number of times filtered
    timesFiltered++;

    
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
  filter.handle = function( selection ) {
    if(!enabled) {
      return;
    }

    if(elementTools.isNode(selection)) {
      nodeLinks = selection.links();
      
      //working handler on click! 
      unfilteredProperties.forEach(function(property) {
        if(property.domain().id() == selection.id() ||
          property.range().id() == selection.id()) {

          // TO REVIEW: right now it is pushing no matter if the 
          // node is a child or parent of that selection
          // NOTE: comment the else statement if want only children of the nodes
          if(property.domain().id() == selection.id()) {
              importantNodes.push(property.range().id());
          }
           else {
              importantNodes.push(property.domain().id());
          }
        }
      });
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
      if(node.id() == importantNodes[i]) {
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
  
  filter.reset = function () {
    importantNodes = ["232", "105"];
  }
  
  // Functions a filter must have
  filter.filteredNodes = function (){
    return filteredNodes;
  };
  
  filter.filteredProperties = function (){
    return filteredProperties;
  };
  
  
  return filter;
};
