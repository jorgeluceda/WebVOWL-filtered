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
  var importantNodes = ["232", "105", "226"];
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
      var nodeLinks = selection.links();
      var unfilteredNodeLinks;
      unfilteredNodes.forEach(function(node) {
        if(node.id() == selection.id()) {
          unfilteredNodeLinks = node.links();
        }
      });

      var linkCounter = 0;
      unfilteredNodeLinks.forEach(function(link) {
        importantNodes.push(link.domain().id());
        alert(JSON.stringify("Node being pushed: " + link.range().id()));
        alert(JSON.stringify(importantNodes));
        linkCounter++;
      });
    
      alert(JSON.stringify("Amount of links: " + linkCounter));

    }
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

// PREVIOUS METHOD USING UNFILTERED PROPERTIES THAT 
// CORRECTLY INSERTED NODES TO GRAPH
// unfilteredProperties.forEach(function(property) {
//   if(property.domain().id() == selection.id() ||
//     property.range().id() == selection.id()) {

//     // NOTE: comment the else statement if want only children of the nodes
//     if(property.domain().id() == selection.id()) {

//       property.range().collapsible(true);
//       selection.collapsible(false);
//       importantNodes.push(property.range().id());
//     }
//      else {
//       property.domain().collapsible(true);
//       selection.collapsible(false);
//       importantNodes.push(property.domain().id());
//     }
//   }
// });