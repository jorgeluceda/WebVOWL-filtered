var elementTools = require("../util/elementTools")();
var filterTools = require("../util/filterTools")();

module.exports = function (){
  
  var filter = {},
    nodes,
    properties,
    enabled = true,
    filteredNodes,
    filteredProperties;
  
  
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
  
  function removeDatatypesAndLiterals(){
    var filteredData = filterTools.filterNodesAndTidy(nodes, properties, isImportantNode);
    
    nodes = filteredData.nodes;
    properties = filteredData.properties;
  }
  
  function isImportantNode( node ){
    // for future reference: element if it is a subclass of, or disjoint with 
    //  if ( element.type() === "rdfs:subClassOf" || element.type() === "owl:disjointWith" ) {
    // alert(JSON.stringify(node.labelForCurrentLanguage()));
    return (node.labelForCurrentLanguage() == "flood" || 
            node.labelForCurrentLanguage() == "coastal flood") ? true : false;
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
