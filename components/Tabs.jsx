import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  StyleSheet,
  View
} from 'react-native';
import Calls from './Calls/Calls';
import Chat from './Chats/Chat';
import Communities from './Communities/Communities';
import Updates from './Updates/Updates';
const Tab = createMaterialTopTabNavigator();


export default function MyTabs() {
    
  return (
    <Tab.Navigator
      initialRouteName="Chats"
      tabBarPosition="bottom"
      screenOptions={{
        tabBarLabelStyle: styles.title,
        tabBarStyle: styles.tab,
      }}
    >
      <Tab.Screen
        name="Chats"
        component={Chat}
        options={{ 
            tabBarLabel: 'Chats',
            tabBarIndicator: () => (
                <View style={{left:20, top: 8, height: 33, width: 60, transition: 'ease-in-out .5', backgroundColor: 'rgba(95, 252, 123,0.2)', borderRadius: 20}} />
            ),
        tabBarIcon: () => (
            <MaterialCommunityIcons name="message-text-outline" size={24} color="white" />
        ),
        }}
      />
      <Tab.Screen
        name="Updates"
        component={Updates}
        options={{ tabBarLabel: 'Updates' ,
        tabBarIndicator: () => (
            <View style={{left:127, top: 8, height: 33, width: 60, backgroundColor: 'rgba(95, 252, 123,0.2)', borderRadius: 20}} />
        ),
            tabBarIcon: () => (
                <MaterialIcons name="downloading" size={24} color="white" />
            ),
        }}
      />
      <Tab.Screen
        name="Communities"
        component={Communities}
        options={{ tabBarLabel: 'Communities' ,
        tabBarIndicator: () => (
            <View style={{left:230, top: 8, height: 33, width: 60, backgroundColor: 'rgba(95, 252, 123,0.2)', borderRadius: 20}} />
        ),
            tabBarIcon: () => (
                <MaterialCommunityIcons name="account-group" size={24} color="white" />
            ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={Calls}
        options={{ tabBarLabel: 'Call' ,
        tabBarIndicator: () => (
            <View style={{left:332, top: 8, height: 33, width: 60, backgroundColor: 'rgba(95, 252, 123,0.2)', borderRadius: 20}} />
        ),
            tabBarIcon: () => (
                <Ionicons name="call-outline" size={24} color="white" />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
    tab: {
    backgroundColor: '#011513',
    height: 70,
    },
    icon: {
        alignSelf: 'center',
        width: 30,
        height: 30,
    },
    title: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
    },
})