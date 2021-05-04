import { Card } from '../models'

function CardView(){
    var card = this.props.card
    return (
        <div className="card" style={{borderRadius:"3px",background:"black", border:"1px solid white", padding:"10px", margin:"10px", cursor:this.props.onClick != null ? 'pointer' : 'default'}} onClick={this.props.onClick}>
            <div>image</div>
            <div>cost</div>
            <div>points (only show if doesnt match with cost)</div>
            <div>name</div>
            <div>description</div>
        </div>
    )
}