qx.Class.define("desk.fileBrowser", 
{
  extend : qx.ui.window.Window,

	construct : function()
	{
		this.base(arguments);

		this.setLayout(new qx.ui.layout.VBox());
		this.setShowClose(false);
		this.setShowMinimize(false);
		this.setUseMoveFrame(true);
		this.setCaption("files");
		this.open();

		var tree = new qx.ui.tree.Tree().set({width : 300, height : 400 });
		tree.setUserData("fileBrowser", this);

		var root = new qx.ui.tree.TreeFolder(this.__baseDir);
		root.setOpen(true);
		tree.setRoot(root);
		root.setUserData("parent_directory","");
		this.add(tree,{flex: 1});

		function expandDirectoryListing(node) {
			var fileBrowser=node.getTree().getUserData("fileBrowser");
			node.removeAll();
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function()
			{
				if(this.readyState == 4 && this.status == 200)
				{
					//	alert("ajax.responseText : " + ajax.responseText);
					var files=ajax.responseText.split("\n");
					var filesArray=new Array();
					var directoriesArray=new Array();
					for (var i=0;i<files.length;i++)
					{
						var splitfile=files[i].split(" ");
						var fileName=splitfile[0];
						if (fileName!="")
						{
							if (splitfile[1]=="file")
								filesArray.push(fileName);
							else
								directoriesArray.push(fileName);
						}
					}
					directoriesArray.sort();
					filesArray.sort();

					for (var i=0;i<directoriesArray.length;i++)
					{
						var directorynode=new qx.ui.tree.TreeFolder(directoriesArray[i]);
						node.add(directorynode);
						directorynode.setUserData("parent_directory", fileBrowser.getNodePath(node));
						directorynode.addListener("click", function(event){
							expandDirectoryListing(this);},
							directorynode);
					}

					for (var i=0;i<filesArray.length;i++)
					{
						var filenode=new qx.ui.tree.TreeFile(filesArray[i]);
						node.add(filenode);
						filenode.addListener("click", function(event){
							if (fileBrowser.__fileHandler!=null)
							fileBrowser.__fileHandler(fileBrowser.getNodeURL(this));},filenode);
					}
				}
				else if (this.readyState == 4 && this.status != 200)
				{
					// fetched the wrong page or network error...
					alert('"Fetched the wrong page" OR "Network error"');
				}
			};
			ajax.open("POST", "/visu/listdir.php", false);
			ajax.send(fileBrowser.getNodePath(node));
		}

		expandDirectoryListing(root);
		root.addListener("click", function(event){
			expandDirectoryListing(this);
			},root);
		return (this);
	},

	members : {
		__fileHandler : null,
		__baseURL : "http://vip.creatis.insa-lyon.fr:8080/visu/",
		__baseDir : "data",

		setFileHandler : function (callback) {
			this.__fileHandler=callback;
		},

		getNodeURL : function (node)
		{
			var fileBrowser=node.getTree().getUserData("fileBrowser");
			return (this.__baseURL+fileBrowser.getNodePath(node));
		},

		getNodePath : function (node)
		{
			if (node.getLabel()==this.__baseDir)
				return (this.__baseDir);
			else
			{
				var parent=node.getParent().getUserData("parent_directory");
				if (parent=="")
					return (node.getParent().getLabel()+"\/"+node.getLabel());
				else			
					return (node.getParent().getUserData("parent_directory")+
					"\/"+
					node.getParent().getLabel()+
					"\/"+
					node.getLabel());
			}
		}
	}
});
