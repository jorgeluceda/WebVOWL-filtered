var elementTools = require("../util/elementTools")();
var filterTools = require("../util/filterTools")();

// filterAndHandle function
// Note: using node.collapsible property to mean a node
//       is expandable instead.
module.exports = function (){
  var filter = {},
    nodes,
    properties,
    enabled = true,
    filteredNodes,
    filteredProperties;
  
  var unfilteredNodes, unfilteredProperties;
  //considering "flash foods" and "flash flooding" as important nodes for now
  var importantNodes = ["232", "226", "105"];
  var timesFiltered = 1;
  var handled = false;
  var currentNode;
  
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

      unfilteredNodes.forEach( function(node) {
        //set the other nodes displayed that are
        //not initially expanded to be expandable
        if(node.id() == importantNodes[1] || 
            node.id() == importantNodes[2]) {
          node.collapsible(true);
        }
      }); 
    }

    if(handled) {
      currentNode.links().forEach(function(currentNodeLink) {
        if(importantNodes.includes(currentNodeLink.range().id())) {
          currentNodeLink.range().collapsible(false);
        } 
        if(importantNodes.includes(currentNodeLink.domain().id())) {
          currentNodeLink.domain().collapsible(false);
        }
      });

      handled = false;
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

    handled = true;

    if(elementTools.isNode(selection)) {

      unfilteredNodes.forEach(function(node) {
        if(node.id() == selection.id()) {
          unfilteredNodeLinks = node.links();
        }
      });

      unfilteredProperties.forEach(function(property) {
        //push if it is not an important node
        if(!importantNodes.includes(property.domain().id()) ||
            !importantNodes.includes(property.range().id())) {

          if(property.domain().id() == selection.id()) {

            property.range().collapsible(true);
            selection.collapsible(false);
            importantNodes.push(property.range().id());
            currentNode = property.range();
          }
          if(property.range().id() == selection.id()) {
            property.domain().collapsible(true);
            selection.collapsible(false);
            importantNodes.push(property.domain().id());
            currentNode = property.domain();
          }

        }
      });

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
    importantNodes = ["232", "226", "105"];
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