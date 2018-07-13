import React , {Component} from 'react';
import './List.css';
import logo from './burger.png';
import escapeRegExp from 'escape-string-regexp';

class List extends Component {
    state = {
        query :'',
        markers:this.props.markers,
        places:this.props.places
    }

    updateQuery(query){
        /* checking any update occurs in filter input */
        this.setState({query},()=>{
            if (query===''){this.setState({places:this.props.places},()=>{this.props.updateMarker(this.props.places);});}
            if (this.state.query!=='')
            {
            const match = new RegExp (escapeRegExp(this.state.query.toLowerCase()));
            let newList = this.props.places.filter( (place) => match.test(place.name.toLowerCase()) );
            if (newList.join('')!==this.state.places.join(''))
            {this.setState({places:newList},()=>{this.props.updateMarker(newList);});}
            }
        });   
    }
    componentDidMount(){
        /* adding hamburger menu for sake of responsiability in case of small devices */
        document.querySelector('.hamburger').addEventListener('click',()=>{
            document.querySelector('.sidebar').classList.toggle('show');
            document.querySelector('#map').classList.toggle('show');
        });
        
    }
    
    render(){
 
    return (
    
    <div className='sidebar show'>
        <div className='toolbox'>
            <img className='hamburger' alt='menu icon' src={logo}/>
            <input role='search' aria-labelledby='Parks Filter' className='filter-bar' placeholder='Filter Parks' value={this.state.query} onChange={(event)=>this.updateQuery(event.target.value)}></input>
        </div>
        <ol className='list'> 
        {
            this.state.places.map((place,idx)=>{

            return (
                <div className='park-div' key={idx}>
                <li role='button' tabIndex='0' className='Park' onClick={()=>{this.props.attach(idx);}}>{place.name}</li>
                <hr className='separator'></hr>
                </div>)
            })
        }
       
        </ol>
    </div>);
    
}

}


export default List;