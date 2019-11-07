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
  var importantNodes = ["flood", "coastal flood"];
  var timesFiltered = 1;
  
  /**
   * If enabled, all datatypes and literals including connected properties are filtered.
   * @param untouchedNodes
   * @param untouchedProperties
   */
  filter.filter = function ( untouchedNodes, untouchedProperties ){
    nodes = untouchedNodes;
    properties = untouchedProperties;

    alert(JSON.stringify("I've been called: " + timesFiltered + " times"));
    if(timesFiltered <= 1) {
      unfilteredNodes = untouchedNodes;
      unfilteredProperties = untouchedProperties;

      //for each node, check if it is "flood", then print the initial,
      //unfiltered node link amount
      unfilteredNodes.forEach(function(node) {
        if(node.labelForCurrentLanguage() == "flood") {
          var unfilteredNodeLinks = node.links();
          var numberOfLinks = 0;
          unfilteredNodeLinks.forEach(function(link) {
            numberOfLinks++;
          });
          alert(JSON.stringify("Number of links in flood node: " + numberOfLinks));
        }     
      });
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

      // NOTE link.range() and link.domain() provide the node link target
      // and link source respectively

      //iterarte through "unfiltered" nodes, note that at this point the
      //number of links have already been filtered.
      //TODO: need a way to save the original state of the 
      //unfiltered nodes
      unfilteredNodes.forEach(function(node) {
        if(node.labelForCurrentLanguage() == selection.labelForCurrentLanguage()) {
          var unfilteredNodeLinks = node.links();
          var numberOfLinks = 0;
          unfilteredNodeLinks.forEach(function(link) {
            numberOfLinks++;
          });
          alert(JSON.stringify("Number of links in " + node.labelForCurrentLanguage() + " node: " + numberOfLinks));
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
