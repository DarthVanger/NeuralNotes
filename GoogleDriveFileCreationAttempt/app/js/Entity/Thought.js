/**
 * Thought class
 */
function Thought() {
    var id;
    var title;
    var parentId;
    var content;
    var links;

    this.getId = function() {
        return id;
    }
    this.getTitle = function() {
        return title;
    }
    this.getParentId = function() {
        return parentId;
    }
    this.getContent = function() {
        return content;
    }
    this.getLinks = function() {
        return links;
    }

    this.setId = function(p_id) {
        id = p_id;
    }
    this.setTitle = function(p_title) {
        title = p_title;
    }
    this.setParentId = function(p_id) {
        parentId = p_parentId;
    }
    this.setContent = function(p_content) {
        content = p_content;
    }
    this.setLinks = function(p_links) {
        links = p_links;
    }
}
