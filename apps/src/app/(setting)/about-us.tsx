import { Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'

const AboutUs = () => {
  const isAndroid = Platform.OS === 'android';

  return (
    <SafeAreaView className="bg-white h-full relative flex-1">
      <View className={`flex-row flex items-center pb-2 relative mb-4 ${isAndroid && 'mt-20'}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute ml-4 bottom-0 bg-[#64748B14] h-12 w-12 items-center justify-center rounded-full"
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-[#1E293B] text-xl m-auto">Giới thiệu</Text>
      </View>
      <ScrollView className="px-4 flex-1">
        <Text className="text-[#64748B]">
          Lorem ipsum dolor sit amet consectetur. Vitae quis dui a justo mauris faucibus hendrerit.
          Fringilla diam facilisis morbi gravida porttitor eget dapibus. In quis molestie faucibus
          consectetur at. Aliquet eu nunc id egestas sollicitudin erat. Dolor sagittis pellentesque
          adipiscing enim egestas nam ac arcu. Senectus donec tempor sapien odio nec ultrices
          lectus. Fermentum amet aliquam convallis at. Mi sed vel sit quis mauris amet lectus.
          Auctor quam tortor eget nibh. A viverra ut ac diam. Netus id mauris nec euismod fringilla
          sollicitudin. Ultrices vulputate facilisis semper elementum urna purus cursus nulla.
          {'\n'}
          {'\n'}
          Etiam mauris urna congue eu. Nulla metus sed fames sapien urna volutpat urna vestibulum
          volutpat. Mauris velit tincidunt morbi id molestie diam diam. Sed rhoncus habitant risus
          maecenas proin. Orci facilisi dui auctor fames pretium accumsan augue dignissim. Quis id
          ipsum amet lacus ut nunc suspendisse pretium. Nisl fermentum adipiscing malesuada sit.
          Porttitor volutpat nisl nibh in nunc aliquet. Interdum quis nunc suspendisse tempor nisl
          convallis. Lobortis enim id in arcu morbi scelerisque fermentum. Tincidunt quis id
          imperdiet tincidunt ut tellus aliquam praesent lacus. Pellentesque tincidunt sit senectus
          quam adipiscing at magna mi quam. Scelerisque dolor tellus mattis mattis enim facilisi
          proin. Quam bibendum et pellentesque vivamus ullamcorper risus. Habitant molestie
          penatibus urna orci.
          {'\n'}
          {'\n'}
          Scelerisque auctor convallis nunc viverra cras sed fames. Sed et elementum orci
          pellentesque feugiat at elementum ipsum. Tristique ullamcorper in quis tortor. Enim nunc
          sem non in. Dignissim mattis adipiscing turpis risus commodo aliquam lectus. Maecenas
          ipsum aliquam morbi vitae mi viverra. Et sed dolor vitae dui arcu. Duis augue suspendisse
          nulla pulvinar nibh nibh amet. Nisi sodales vivamus eros nulla ultricies quam dictum.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AboutUs
