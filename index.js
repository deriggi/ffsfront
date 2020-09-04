import React from 'react'
import ReactDOM from 'react-dom'
import { Pane, Checkbox, Text, Table } from 'evergreen-ui'

const FFS_BASE = 'http://localhost:8080/ffs';
const REGIONS_BASE = 'http://localhost:8080/regions';


class DataPuller extends React.Component {

        
    constructor(props) {
        super(props)
        this.state = {
            regions:[],
            sites: []
        }

    }

    componentDidMount() {
        console.log("fetching");
        fetch(`${FFS_BASE}`)
          .then(data => data.json())
          .then(asJson => {
            console.log(asJson)
            this.setState({sites: asJson});
            console.log(this.state)
          }).catch(e => console.log(e));

          fetch(`${REGIONS_BASE}`)
          .then(data => data.json())
          .then(asJson => {
            console.log(asJson)
            this.setState({regions: asJson});
            console.log(this.state)
          }).catch(e => console.log(e));
        
      }

      handleChange(e, row , i){
        // console.log(e.target.checked, i);
        let newFlag = this.state.sites[row].flags[i] ===0?1:0
        this.setState(state => (this.state.sites[row].flags[i] = newFlag, state));
        this.updateStatus(row,i, newFlag);
      }

      updateStatus(row, i, newFlag){
        let site = {...this.state.sites[row]};
        site.flags[i] = newFlag;
        site.value = parseInt(site.flags.join(''), 2)
        console.log(site);

          fetch(`${FFS_BASE}`, this.makePostOptions(site))
          .then(res => res.json())
          .then(asJson => this.setState({sites:asJson}))
          .catch(e => console.log(e));


      }



      makeTableRow(fs, row){
         
        let p = 
        <Table.Row key={row}>
            <Table.TextCell>{fs.name}</Table.TextCell>
            {fs.flags.map( (flag, i) => this.makeCheckBox(flag, row, i))}
        </Table.Row>

        return p;

      }

      makeHeaderCell(region, row){        
           return  <Table.TextHeaderCell key={row} flexBasis={560} flexShrink={0} flexGrow={0} >{region}</Table.TextHeaderCell>
      }

      makePostOptions(data){
        return {method:'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data) }
      }

      makeCheckBox(flag, row, i){
        return <Table.Cell ><Checkbox checked={flag===1}  onChange={e => this.handleChange(e, row, i)}/></Table.Cell>
      }

      render(){
          return (
            <Pane width={840} elevation={1} margin="auto" marginTop={30}>
                <Table margin={1}>
                    <Table.Head>
                    {this.makeHeaderCell('feature', -1)}
                    {this.state.regions.map( (region,i) => this.makeHeaderCell(region, i) )}
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