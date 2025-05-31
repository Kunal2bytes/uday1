
// src/app/about-us/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Info, Lightbulb, Search, Bus, CheckCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext'; 
import { useRouter } from 'next/navigation'; 
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  en: {
    pageTitle: "Welcome to HOPE!",
    pageDescription: "Learn a bit about us and our mission before you get started.",
    teamVisionTitle: "Our Team & Vision",
    teamVisionIntro: "Koushal Mahajan and Uday Jatale, both Computer Science Engineering students, have partnered to develop this app with a shared vision:",
    teamVisionQuote: "To make transportation more affordable, accessible, and environmentally friendly for everyone—especially those who do not own a bike or car, or rely on public buses.",
    purposeTitle: "Purpose of the App",
    purposeDescription: "The idea behind this app is simple but powerful:",
    purposeParagraph1: "If someone is traveling alone by bike or car and either wants to share the cost of fuel or prefers not to travel alone, they can use the “Share Your Ride” feature. By entering their ride details, they can connect with others who are going to the same destination but don’t have a vehicle.",
    purposeAllowsUsersTitle: "This allows users to:",
    purposeAllowsUsersPoints: [
      "Split the cost of fuel",
      "Reduce the number of vehicles on the road",
      "Minimize pollution",
      "Travel more socially and safely",
    ],
    purposeParagraph2: "If both users have a vehicle and are heading to the same place, they can still connect and choose to travel together on just one bike or car to save fuel and help the environment.",
    additionalFeaturesTitle: "Additional Features",
    nearbyAutosTitle: "Nearby Auto-Rickshaws",
    nearbyAutosDesc: "You can also search for nearby auto-rickshaws for short-distance travel.",
    busScheduleTitle: "Bus Schedule & Route Finder",
    busScheduleDesc: "If you're new to a city, district, or state and don’t know the bus routes, the app includes a bus schedule and route finder. Simply select the state and district, enter the city or village name, and you'll get accurate information about available bus services.",
    gotItButton: "Got it! Let's Go",
    proceedingButton: "Proceeding...",
  },
  hi: {
    pageTitle: "होप में आपका स्वागत है!",
    pageDescription: "शुरू करने से पहले हमारे और हमारे मिशन के बारे में थोड़ा जान लें।",
    teamVisionTitle: "हमारी टीम और दृष्टिकोण",
    teamVisionIntro: "कौशल महाजन और उदय जाटले, दोनों कंप्यूटर साइंस इंजीनियरिंग के छात्र, इस ऐप को एक साझा दृष्टिकोण के साथ विकसित करने के लिए साझेदारी की है:",
    teamVisionQuote: "परिवहन को सभी के लिए अधिक किफायती, सुलभ और पर्यावरण के अनुकूल बनाना - विशेष रूप से उन लोगों के लिए जिनके पास बाइक या कार नहीं है, या जो सार्वजनिक बसों पर निर्भर हैं।",
    purposeTitle: "ऐप का उद्देश्य",
    purposeDescription: "इस ऐप के पीछे का विचार सरल लेकिन शक्तिशाली है:",
    purposeParagraph1: "यदि कोई बाइक या कार से अकेले यात्रा कर रहा है और या तो ईंधन की लागत साझा करना चाहता है या अकेले यात्रा नहीं करना चाहता है, तो वे \"अपनी सवारी साझा करें\" सुविधा का उपयोग कर सकते हैं। अपनी सवारी का विवरण दर्ज करके, वे उन अन्य लोगों से जुड़ सकते हैं जो उसी गंतव्य पर जा रहे हैं लेकिन उनके पास वाहन नहीं है।",
    purposeAllowsUsersTitle: "यह उपयोगकर्ताओं को अनुमति देता है:",
    purposeAllowsUsersPoints: [
      "ईंधन की लागत विभाजित करें",
      "सड़क पर वाहनों की संख्या कम करें",
      "प्रदूषण कम करें",
      "अधिक सामाजिक और सुरक्षित रूप से यात्रा करें",
    ],
    purposeParagraph2: "यदि दोनों उपयोगकर्ताओं के पास एक वाहन है और वे एक ही स्थान पर जा रहे हैं, तो वे अभी भी जुड़ सकते हैं और ईंधन बचाने और पर्यावरण की मदद करने के लिए सिर्फ एक बाइक या कार पर एक साथ यात्रा करना चुन सकते हैं।",
    additionalFeaturesTitle: "अतिरिक्त विशेषताएँ",
    nearbyAutosTitle: "आस-पास के ऑटो-रिक्शा",
    nearbyAutosDesc: "आप कम दूरी की यात्रा के लिए आस-पास के ऑटो-रिक्शा भी खोज सकते हैं।",
    busScheduleTitle: "बस अनुसूची और मार्ग खोजक",
    busScheduleDesc: "यदि आप किसी शहर, जिले या राज्य में नए हैं और बस मार्गों को नहीं जानते हैं, तो ऐप में एक बस शेड्यूल और मार्ग खोजक शामिल है। बस राज्य और जिले का चयन करें, शहर या गांव का नाम दर्ज करें, और आपको उपलब्ध बस सेवाओं के बारे में सटीक जानकारी मिल जाएगी।",
    gotItButton: "समझ गया! चलिए चलते हैं",
    proceedingButton: "आगे बढ़ रहा है...",
  }
};


export default function AboutUsPage() {
  const { user, loading: authLoading } = useAuth(); 
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const handleGotItClick = async () => {
    setIsProcessing(true);
    if (user) {
      router.push('/');
    } else {
      router.push('/signin'); 
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-8">
          <div className="flex items-center justify-center sm:justify-start mb-2 pt-8 sm:pt-12">
            <Info className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-center sm:text-left text-primary">{t.pageTitle}</h1>
          </div>
           <p className="text-muted-foreground text-center sm:text-left">
            {t.pageDescription}
          </p>
        </header>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="mr-2 h-6 w-6 text-primary" />
                {t.teamVisionTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                {t.teamVisionIntro}
              </p>
              <blockquote className="pl-4 border-l-4 border-primary italic text-foreground/90">
                {t.teamVisionQuote}
              </blockquote>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="mr-2 h-6 w-6 text-primary" />
                {t.purposeTitle}
              </CardTitle>
              <CardDescription>{t.purposeDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                {t.purposeParagraph1}
              </p>
              <p className="text-foreground/90 font-medium">{t.purposeAllowsUsersTitle}</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                {t.purposeAllowsUsersPoints.map((point, index) => <li key={index}>{point}</li>)}
              </ul>
              <p className="text-muted-foreground">
                {t.purposeParagraph2}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Lightbulb className="mr-2 h-6 w-6 text-primary" />
                {t.additionalFeaturesTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start">
                <Search className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">{t.nearbyAutosTitle}</h4>
                  <p className="text-muted-foreground">{t.nearbyAutosDesc}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Bus className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">{t.busScheduleTitle}</h4>
                  <p className="text-muted-foreground">{t.busScheduleDesc}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-10 mb-6">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-8 rounded-lg shadow-md transition-transform duration-150 hover:scale-105 flex items-center"
              onClick={handleGotItClick}
              disabled={isProcessing || authLoading} 
            >
              {isProcessing ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <CheckCircle className="mr-2 h-5 w-5" />}
              {isProcessing ? t.proceedingButton : t.gotItButton}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

    