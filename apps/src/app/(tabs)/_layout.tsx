import React from 'react'
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import IconPlayChessActive from '~/assets/icon-svg/BottomTab/IconPlayChessActive'
import IconPlayChess from '~/assets/icon-svg/BottomTab/IconPlayChess'
import IconHome from '~/assets/icon-svg/BottomTab/IconHome'
import IconHomeActive from '~/assets/icon-svg/BottomTab/IconHomeActive'
import IconPractiveActive from '~/assets/icon-svg/BottomTab/IconPractiveActive'
import IconPractive from '~/assets/icon-svg/BottomTab/IconPractive'
import IconRankActive from '~/assets/icon-svg/BottomTab/IconRankActive'
import IconRank from '~/assets/icon-svg/BottomTab/IconRank'

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#734DBE',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          borderWidth: 1,
          borderColor: '#E5E7EB',
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }) => (
            <View>{color === '#734DBE' ? <IconHomeActive /> : <IconHome />}</View>
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Trắc nghiệm',
          tabBarIcon: ({ color }) => (
            <View>{color === '#734DBE' ? <IconPractiveActive /> : <IconPractive />}</View>
          ),
        }}
      />
      <Tabs.Screen
        name="play-situation"
        options={{
          title: 'Trò chơi',
          tabBarIcon: ({ color }) => (
            <View>{color === '#734DBE' ? <IconPlayChessActive /> : <IconPlayChess />}</View>
          ),
        }}
      />
      <Tabs.Screen
        name="rank"
        options={{
          title: 'Xếp hạng',
          tabBarIcon: ({ color }) => (
            <View>{color === '#734DBE' ? <IconRankActive /> : <IconRank />}</View>
          ),
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
