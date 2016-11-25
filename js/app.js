'use strict';
var my_news = [
    // {
    //     author: 'Anna',
    //     text: 'High priority',
    //     bigText: 'Task descriptionbz.jhetg/oethjbETJNRPYjro YPjntpijjzNPZO itibhuzutrhubcdhgvvvvbuidhrghhhhhhhhhhh'
    // },
    // {
    //     author: 'Irina',
    //     text: 'High priority',
    //     bigText: 'Task description'
    // },
    {
        author: 'Shepperd',
        text: 'High priority',
        bigText: 'Task description'
    },
    {
        author: 'Rami',
        text: 'High priority',
        bigText: "Task description"
    }
];

window.ee = new EventEmitter();

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape ({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },

    getInitialState: function() {
        return {
            visible: false
        }
    },
    readmoreClick: function (e){
        e.preventDefault();
        this.setState({visible: true});
    },

    render: function () {
        var author = this.props.data.author,
            text = this.props.data.text,
            bigText = this.props.data.bigText,
            visible = this.state.visible;

        return (
            <div className= "article">
                <p className= "news_author">{author}:</p>
                <p className= "news_text">{text}</p>

                {/* для ссылки readmore: не показывай ссылку, если visible === true */}
                <a href="#" 
                onClick = {this.readmoreClick}
                className={"news_readmore" + (visible ? 'none': '') }>Description
                </a>

                {/* для большо текста: не показывай текст, если visible === false */}
                <p className= {"news_bigText" + (visible ? '': 'none')}>{bigText}</p>
            </div>
        )
    }
})

var News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    getInitialState: function() {
        return {
            counter: 0
        }
    },

    render: function() {
        var data = this.props.data;
        var newsTemplate;

        if (data.length > 0) {
            newsTemplate = data.map(function(item, index) {
                return (
                    <div key={index}>
                        <Article data= {item}/>
                    </div>
                )
            })
        } else {
            newsTemplate = <p>:) we haven't any tasks</p>
        }
        return (
            <div className="news">
                {newsTemplate}
                <strong
                className={'news_count '+ (data.length > 0 ? '':'none')}>
                Quantity of tasks: {data.length}
                </strong>
            </div>
        );
    }
});
var Add = React.createClass({
    getInitialState: function() {
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            bigTextIsEmpty: true,
            textIsEmpty: true
        };
    },
    componentDidMount: function(){
        ReactDOM.findDOMNode(this.refs.author).focus();
    },
    onButtonClickHandler: function(e) {
       e.preventDefault();
       var textEl = ReactDOM.findDOMNode(this.refs.bigText);
       var bigText = textEl.value;
       var auth = ReactDOM.findDOMNode(this.refs.author);
       var author = auth.value;
       var priority = ReactDOM.findDOMNode(this.refs.text);
       var text = priority.value;
       
       var item = [{
        author: author,
        text: text,
        bigText: bigText
       }];
       window.ee.emit('News.add', item);
       textEl.value = '';
       priority.value = '';
       auth.value = '';
       this.setState({bigTextIsEmpty: true});
    },
    onCheckRuleClick: function(e) {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    },
   
    onFieldChange: function(fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({['' + fieldName] : false})
        } else {
             this.setState({['' + fieldName] : true})
        }
    },
    render: function() {
        var agreeNotChecked = this.state.agreeNotChecked,
            authorIsEmpty = this.state.authorIsEmpty,
            textIsEmpty = this.state.textIsEmpty,
            bigTextIsEmpty = this.state.bigTextIsEmpty;
        return (
        <form className = 'add cf'>
           <input
                type= 'text'
                className= 'add_author'
                onChange = {this.onFieldChange.bind(this, 'authorIsEmpty')}
                placeholder= 'Name'
                ref= 'author'
                />
           <input
                type= 'text'
                className= 'add_text'
                onChange = {this.onFieldChange.bind(this, 'textIsEmpty')}
                placeholder= 'Priority'
                ref= 'text'
                />
           <textarea
                className= 'add_bigText'
                onChange = {this.onFieldChange.bind(this, 'bigTextIsEmpty')}
                placeholder= 'Task description'
                ref= 'bigText' >
            </textarea>
            <label className= 'add_checkrule'>
                <input type= 'checkbox' ref= 'checkrule' onChange= {
                   this.onCheckRuleClick} />
                I'm sure
             </label>

            <button
                className= 'add_btn'
                onClick= {this.onButtonClickHandler}
                ref= 'add_button'
                disabled= {agreeNotChecked || authorIsEmpty || textIsEmpty || bigTextIsEmpty} >
                    Add task
            </button>
         </form>
        );
    }
});

var App = React.createClass({

    getInitialState: function() {
        return {
            news: my_news
        };
    },
    componentDidMount: function() {
        /*catch 'task is created' and reload this.state.news'*/
        var self = this;
        window.ee.addListener('News.add', function(item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },

    componentWillUnmount: function() {
        /*stop catching 'task is created'*/
        window.ee.removeListener('News.add');
    },
    render: function() {
        console.log('render');
        return (
            <div className="app">
                <h3>TASKS</h3>
                <Add /> {/*Добавила вывод компонента*/}
                <News data={this.state.news} />
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);