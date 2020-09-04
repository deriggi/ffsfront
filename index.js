import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'evergreen-ui'

const API_BASE = 'http://localhost:8080/ffs';


class DataPuller extends React.Component {

        
    constructor(props) {
      super(props)
      this.state = {
        sites: []
      }
    }

    componentDidMount() {
        console.log("fetching");
        fetch(`${API_BASE}`)
          .then(data => data.json())
          .then(asJson => {
            console.log(asJson)
            this.setState({sites: asJson});
            console.log(this.state)
          }).catch(e => console.log(e));
        
      }

      render(){
          return (
            <div>            
                {this.state.sites.map( (s,i) => <div key={i}>{s.name}</div>)}
            </div>

          );
      }

}
ReactDOM.render(
  <DataPuller/>,
  document.getElementById('root')
)