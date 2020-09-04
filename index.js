import React from 'react'
import ReactDOM from 'react-dom'
import { Pane, Checkbox, Text, Table } from 'evergreen-ui'

const API_BASE = 'http://localhost:8080/ffs';

const MAX_LENGTH = 5;

class DataPuller extends React.Component {

        
    constructor(props) {
        super(props)
        this.state = {
            header:[],
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

      handleChange(e, row , i){
        console.log(e.target.checked, i);
        let x = this.state.sites[row].flags[i] ===0?1:0
        this.setState(state => (this.state.sites[row].flags[i] = x, state));
      }

      makeTableRow(fs, row){
         
        let p = 
        <Table.Row key={row}>
            <Table.TextCell>{fs.name}</Table.TextCell>
            {fs.flags.map( (flag, i) => this.makeCheckBox(flag, row, i))}
        </Table.Row>

        return p;

      }

      makeCheckBox(flag, row, i){
        return <Table.Cell flexBasis={30} flexShrink={0} flexGrow={0}><Checkbox checked={flag===1}  onChange={e => this.handleChange(e, row, i)}/></Table.Cell>
      }

      render(){
          return (
            <Pane width={840} elevation={1} margin="auto" marginTop={30}>
                <Table margin={1}>
                    <Table.Head>
                        {/* <Table.TextHeaderCell>Last Activity</Table.TextHeaderCell>
                        <Table.TextHeaderCell>ltv</Table.TextHeaderCell> */}
                    </Table.Head>
                    <Table.Body >
                        {this.state.sites.map( (s,i) => this.makeTableRow(s, i))}
                    </Table.Body>
                </Table>
            </Pane>
            );



      }

}
ReactDOM.render(
  <DataPuller/>,
  document.getElementById('root')
)