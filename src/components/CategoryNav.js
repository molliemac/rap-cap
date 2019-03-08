import React, {Component} from 'react';

export default class CategoryNav extends React.Component{
 render(){
  return(
   
    <div class="row mb-2">
    	<div id="category-box" class="col-sm-4">
    		<div class="inner mx-2 text-center">
    		COLUMN 1
    		</div>
    	
    	</div>
    	<div id="category-box" class="col-sm-4">
    	<div class="inner mx-2 text-center">
    		COLUMN 2
    		</div>
    	</div>
    	<div id="category-box" class="col-sm-4">
    	<div class="inner mx-2 text-center">
    		COLUMN 3
    		</div>
    	</div>
    </div> 
  );
 }
}