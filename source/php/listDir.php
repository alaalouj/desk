<?php
$dir=mysql_real_escape_string($_POST["dir"]);


$DATA_ROOT_FROM_PHP="data";
$CACHE_ROOT_FROM_PHP="cache";
$ACTIONS_ROOT_FROM_PHP="action";

$begining=substr($dir, 0, strlen($DATA_ROOT_FROM_PHP));
if ($begining!=$DATA_ROOT_FROM_PHP)
{
	$begining=substr($dir, 0, strlen($CACHE_ROOT_FROM_PHP));
	if ($begining!=$CACHE_ROOT_FROM_PHP)
	{
		$begining=substr($dir, 0, strlen($ACTIONS_ROOT_FROM_PHP));
		if ($begining!=$ACTIONS_ROOT_FROM_PHP)
		{
			die ("bad directory : $file\n".
			"begins with \"$begining\"\n".
			"must begin with \"$DATA_ROOT_FROM_PHP\"");
		}
	}
}

// try to open the file
if (is_dir($dir)) {
	// try to open the directory
	if ($dh = opendir($dir)) {
		$count="0";
		while (($file = readdir($dh)) !== false) {
		//iterate on each file
			if (($file!=".")&&($file!=".."))
			{
				if ($count!="0")
					echo "\n";
				$count++;
				// print file name
				echo "$file ";

				$completefile="$dir/$file";

				// print file type
				if (is_dir ( $completefile))
					echo "dir";
				else 
					echo "file";

				// print file modification time
				$mtime=filemtime ( $completefile );
				echo " $mtime";

				// print file size
			 	$fileSize=filesize ( $completefile );
			 	echo " $fileSize";
			}
		}
		closedir($dh);
	}
}
?>