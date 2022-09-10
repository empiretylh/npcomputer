import React, {Component} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Text from '../DefaultText';
import axios from 'axios';
import RenderHtml, {useNormalizedUrl} from 'react-native-render-html';

class AccordionView extends Component {
  constructor(props) {
    super();
    const {sections} = props;
    console.log(sections, 'sese');
    this.state = {
      activeSections: [],
      SECTIONS: sections,
    };
  }

  _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _renderHeader = (section, _, isActive) => {
    console.log(isActive);
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {section.title}
          {isActive}
        </Text>
        {isActive ? (
          <Icons name={'chevron-up-outline'} size={18} color={'#000'} />
        ) : (
          <Icons name={'chevron-down-outline'} size={18} color={'#000'} />
        )}
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={styles.content}>
        <RenderHtml
          contentWidth={useWindowDimensions}
          source={{html: section.content}}
          domVisitors={{
            onElement: e => {
              if (e.name == 'p') {
                console.log(e);
                e.attribs['style'] = 'color:black';
                console.log(e.name);
              }
              if (e.name == 'h1') {
                console.log(e);
                e.attribs['style'] = 'color:black';
                console.log(e.name);
              }
              if (e.name == 'img') {
                const firststring = e.attribs['src'];
                if (!firststring.includes('http')) {
                  e.attribs['src'] = axios.defaults.baseURL + firststring;
                  e.attribs['style'] = 'width : 100%';
                  console.log(e.attribs['src']);
                }
                e.attribs['style'] = 'width : 100%';
              }
            },
          }}
        />
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({activeSections});
    console.log(activeSections);
  };

  render() {
    return (
      <Accordion
        sections={this.state.SECTIONS}
        activeSections={this.state.activeSections}
        touchableComponent={TouchableOpacity}
        expandMultiple={true}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />
    );
  }
}

const styles = StyleSheet.create({
  content: {
    paddingLeft: 25,
    paddingRight: 5,
    backgroundColor: '#daeff2',
  },
  header: {
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',

    borderBottomColor: '#b0b0b0',
    borderBottomWidth: 1,
  },
  headerText: {
    color: 'black',
    fontSize: 19,
   
  },
});

export default AccordionView;
