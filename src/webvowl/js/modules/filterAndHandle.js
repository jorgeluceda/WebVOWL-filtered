var elementTools = require("../util/elementTools")();
var filterTools = require("../util/filterTools")();

/**
 * Contains the logic for our custom FilterAndHandle functionality
 *
 * @param graph required for calling a refresh after a filter change
 * @returns {{}}
 */
module.exports = function (graph){
  var filter = {},
    nodes,
    properties,
    enabled = true,
    filteredNodes,
    filteredProperties;
  
  // considering "flash foods" and "flash flooding" as important nodes for now
  // TODO: make dict with key:values so that we can collapse/expand objects 
  //      on even or odd intervals
  var importantNodes = ["232", "226", "105"];
  var timesFiltered = 1;
  handled = false;
  var currentSelection;

  /**
   * If enabled, all datatypes and literals including connected properties are filtered.
   * @param untouchedNodes
   * @param untouchedProperties
   */
  filter.filter = function ( untouchedNodes, untouchedProperties ){
    // unfilteredData.nodes = nodes;
    nodes = untouchedNodes;
    properties = untouchedProperties;

    if(timesFiltered <= 1) {
      nodes.forEach( function(node) {
        //set the other nodes displayed that are
        //not initially expanded to be expandable
        if(node.id() == importantNodes[1] || 
            node.id() == importantNodes[2]) {
          node.collapsible(true);
        }
      }); 
    }

    //increase number of times filtered
    timesFiltered++;
  
    if ( this.enabled() ) {
      removeDatatypesAndLiterals();
    }

    if(handled == true) {
      nodes.forEach(function(node) {
        if(node.id() == currentSelection.id()) {
          //make node important so its displayed
          pushNodes(node);
          //TODO: check if node has hidden nodes or not
        }
      });
    }

    filteredNodes = nodes;
    filteredProperties = properties;
    handled = false;
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
      selection.collapsible(false);

      currentSelection = selection;
      handled = true;
      //update graph to reset filter
      graph.update();
    }
  }

  function pushNodes(selection) {
    var links = selection.links();
    
    links.forEach(function(link) {
      if(!importantNodes.includes(link.domain().id())) {
        importantNodes.push(link.domain().id());
      }
      
      if(!importantNodes.includes(link.range().id())) {
        importantNodes.push(link.range().id());
      }
    });
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