import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: this.loadLocations()
        };

        this.actions = [{
            icon:'search',
        },{
            icon:'map-pin',
            handleClick:this.addCurrentLocation.bind(this)
        },{
            icon:'gear'
        }];

        this.removeLocation = this.removeLocation.bind(this);
    }

    addCurrentLocation() {
        navigator.geolocation.getCurrentPosition((function(position) {
            var name = prompt("What is the name of this location?", "");

            if (name) {
                this.addLocation({
                    name:name,
                    text:name,
                    lat :position.coords.latitude,
                    lon :position.coords.longitude,
                });
            }

        }).bind(this));
    }

    addLocation($location) {
        var locations = this.state.locations.slice();

        locations.push($location);

        this.setState({
            locations:locations
        });

        this.saveLocations()
    }

    removeLocation(item) {
        var locations = this.state.locations.slice();

        locations = locations.filter(function($location) {
            return $location.name !== item.name;
        });

        this.setState({
            locations:locations
        });

        this.saveLocations(locations)
    }

    saveLocations(locations) {
        localStorage.setItem('locations',JSON.stringify(locations || this.state.locations));
    }

    loadLocations() {
        try {
            var locations = JSON.parse(localStorage.getItem('locations'));
        } catch(e) { }

        if (locations != null) {
            return locations;
        }

        return [];
    }

    openMapPage(item) {
        navigator.geolocation.getCurrentPosition((function(position) {
            var url = "https://www.google.com/maps/dir/?api=1&travelmode=transit&origin="+position.coords.latitude+","+position.coords.longitude+"&destination="+item.lat+","+item.lon;
            window.location = url;
        }).bind(this));
    }

    render() {
        return (
            <div className="App">
                <ActionBar actions={this.actions}/>
                <ListView
                    items={this.state.locations}
                    onItemRemoved={this.removeLocation}
                    onItemSelected={this.openMapPage}
                />
            </div>
        );
    }
}

class ListView extends Component {
    constructor(props) {
        super(props);
        this.renderListItem = this.renderListItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.selectItem = this.selectItem.bind(this);
    }

    removeItem(item) {
        this.props.onItemRemoved(item);
    }

    selectItem(item) {
        this.props.onItemSelected(item);
    }

    renderListItem(item) {
        return <ListItem item={item} onRemove={this.removeItem} onSelect={this.selectItem}/>;
    }

    render() {
        return (
            <ul className="list-view row">
                {this.props.items.map(function(item){
                    return this.renderListItem(item);
                }, this)}
            </ul>
        );
    }
};

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.removeItem = this.removeItem.bind(this);
        this.selectItem = this.selectItem.bind(this);
    }

    removeItem() {
        this.props.onRemove(this.props.item);
    }

    selectItem() {
        this.props.onSelect(this.props.item);
    }

    render() {
        return (
            <li className="list-item text-left col-xs-12">
                <div className="row">
                    <div className="col-xs-10" onClick={this.selectItem}>{this.props.item.text}</div>
                    <div className="col-xs-2" onClick={this.removeItem}>✖</div>
                </div>
            </li>
        );
    }
}


class ActionBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var numActions = this.props.actions.length;
        var actionWidth = Math.round(12/numActions);
        return (
            <div className="action-bar row">
                {this.props.actions.map(function(action){
                    return <ActionButton action={action} width={actionWidth}/>;
                }, this)}
            </div>
        );
    }
}

class ActionButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"button text-center col-xs-"+this.props.width} onClick={this.props.action.handleClick}>
                <i className={"fa fa-"+this.props.action.icon}></i>
            </div>
        );
    }
}

export default App;
