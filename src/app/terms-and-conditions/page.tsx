
// src/app/terms-and-conditions/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ShieldCheck, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  en: {
    pageTitle: "Terms and Conditions",
    pageDescription: "Please read our terms, safety guidelines, and responsibilities carefully.",
    backToDashboard: "Back to Dashboard",
    safetyGuidelinesTitle: "Safety Guidelines for Female Passengers",
    safetyGuidelinesDescription: "To ensure your safety and comfort during every ride, please follow these important precautions:",
    checkChildLockTitle: "Check the Child Lock",
    checkChildLockDesc: "Before getting into a vehicle, ensure that the child lock is disabled. You should be able to open the doors from the inside at all times.",
    verifyDriverTitle: "Verify Driver and Vehicle Information",
    verifyDriverDesc: "Always check the driver’s name, photo, and vehicle number plate against the details shown in the app before entering the vehicle.",
    userResponsibilitiesTitle: "User Responsibilities",
    userResponsibilitiesDescription: "All users of the HOPE app—both passengers and drivers—are expected to maintain a safe, respectful, and lawful environment. By using the app, you agree to the following responsibilities:",
    forAllUsersTitle: "For All Users:",
    forAllUsersPoints: [
      "Treat all fellow users with respect and courtesy at all times.",
      "Do not use the app for illegal, unsafe, or inappropriate activities.",
      "Follow all local traffic laws and safety regulations during your ride.",
    ],
    forDriversTitle: "For Drivers:",
    forDriversPoints: [
      "Keep your vehicle clean, roadworthy, and well-maintained.",
      "Always carry and keep up-to-date a valid driver’s license, vehicle registration, insurance papers, and any other legally required documents.",
      "Use GPS and route tracking to maintain transparency and rider trust.",
      "Ensure that child locks and central locking systems do not restrict rider exit.",
      "Respect the privacy and comfort of all passengers, especially women and girls.",
    ],
    disclaimerTitle: "Disclaimer of Responsibility",
    disclaimerParagraph1: "HOPE provides safety guidelines and platform features to help ensure a secure experience for all users, especially women and girls. However, if a user or driver fails to follow these safety instructions or violates the platform’s rules, and an issue or incident occurs as a result:",
    disclaimerPoints: [
      "HOPE will not be held responsible or liable for any harm, loss, or damage caused.",
      "Each user is responsible for their own actions and for ensuring that all safety precautions are followed during rides.",
    ],
  },
  hi: {
    pageTitle: "नियम एवं शर्तें",
    pageDescription: "कृपया हमारे नियमों, सुरक्षा दिशानिर्देशों और जिम्मेदारियों को ध्यान से पढ़ें।",
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    safetyGuidelinesTitle: "महिला यात्रियों के लिए सुरक्षा दिशानिर्देश",
    safetyGuidelinesDescription: "प्रत्येक सवारी के दौरान आपकी सुरक्षा और आराम सुनिश्चित करने के लिए, कृपया इन महत्वपूर्ण सावधानियों का पालन करें:",
    checkChildLockTitle: "चाइल्ड लॉक की जाँच करें",
    checkChildLockDesc: "वाहन में चढ़ने से पहले, सुनिश्चित करें कि चाइल्ड लॉक अक्षम है। आपको हर समय अंदर से दरवाजे खोलने में सक्षम होना चाहिए।",
    verifyDriverTitle: "ड्राइवर और वाहन की जानकारी सत्यापित करें",
    verifyDriverDesc: "वाहन में प्रवेश करने से पहले हमेशा ऐप में दिखाए गए विवरणों के साथ ड्राइवर का नाम, फोटो और वाहन नंबर प्लेट की जांच करें।",
    userResponsibilitiesTitle: "उपयोगकर्ता की जिम्मेदारियां",
    userResponsibilitiesDescription: "होप ऐप के सभी उपयोगकर्ताओं - यात्रियों और ड्राइवरों दोनों से - एक सुरक्षित, सम्मानजनक और कानूनी वातावरण बनाए रखने की अपेक्षा की जाती है। ऐप का उपयोग करके, आप निम्नलिखित जिम्मेदारियों से सहमत होते हैं:",
    forAllUsersTitle: "सभी उपयोगकर्ताओं के लिए:",
    forAllUsersPoints: [
      "सभी साथी उपयोगकर्ताओं के साथ हर समय सम्मान और शिष्टाचार से पेश आएं।",
      "अवैध, असुरक्षित, या अनुचित गतिविधियों के लिए ऐप का उपयोग न करें।",
      "अपनी सवारी के दौरान सभी स्थानीय यातायात कानूनों और सुरक्षा नियमों का पालन करें।",
    ],
    forDriversTitle: "ड्राइवरों के लिए:",
    forDriversPoints: [
      "अपने वाहन को स्वच्छ, सड़क योग्य और अच्छी तरह से बनाए रखें।",
      "हमेशा एक वैध ड्राइविंग लाइसेंस, वाहन पंजीकरण, बीमा कागजात, और किसी भी अन्य कानूनी रूप से आवश्यक दस्तावेजों को साथ रखें और अद्यतन रखें।",
      "पारदर्शिता और सवार विश्वास बनाए रखने के लिए जीपीएस और मार्ग ट्रैकिंग का उपयोग करें।",
      "सुनिश्चित करें कि चाइल्ड लॉक और सेंट्रल लॉकिंग सिस्टम सवार के बाहर निकलने में बाधा न डालें।",
      "सभी यात्रियों, विशेषकर महिलाओं और लड़कियों की गोपनीयता और आराम का सम्मान करें।",
    ],
    disclaimerTitle: "जिम्मेदारी का अस्वीकरण",
    disclaimerParagraph1: "होप सभी उपयोगकर्ताओं, विशेषकर महिलाओं और लड़कियों के लिए एक सुरक्षित अनुभव सुनिश्चित करने में मदद करने के लिए सुरक्षा दिशानिर्देश और प्लेटफ़ॉर्म सुविधाएँ प्रदान करता है। हालाँकि, यदि कोई उपयोगकर्ता या ड्राइवर इन सुरक्षा निर्देशों का पालन करने में विफल रहता है या प्लेटफ़ॉर्म के नियमों का उल्लंघन करता है, और परिणामस्वरूप कोई समस्या या घटना होती है:",
    disclaimerPoints: [
      "होप किसी भी नुकसान, हानि, या क्षति के लिए जिम्मेदार या उत्तरदायी नहीं होगा।",
      "प्रत्येक उपयोगकर्ता अपने कार्यों के लिए और यह सुनिश्चित करने के लिए जिम्मेदार है कि सवारी के दौरान सभी सुरक्षा सावधानियों का पालन किया जाए।",
    ],
  }
};

export default function TermsAndConditionsPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-8">
          <Link href="/" passHref legacyBehavior>
            <Button variant="outline" className="mb-4 group flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
              {t.backToDashboard}
            </Button>
          </Link>
          <div className="flex items-center justify-center sm:justify-start mb-2">
            <ShieldCheck className="h-8 w-8 text-primary mr-3" />
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
                <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
                {t.safetyGuidelinesTitle}
              </CardTitle>
              <CardDescription>{t.safetyGuidelinesDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start">
                <CheckCircle className="mr-3 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">{t.checkChildLockTitle}</h4>
                  <p className="text-muted-foreground">{t.checkChildLockDesc}</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="mr-3 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">{t.verifyDriverTitle}</h4>
                  <p className="text-muted-foreground">{t.verifyDriverDesc}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="mr-2 h-6 w-6 text-primary" />
                {t.userResponsibilitiesTitle}
              </CardTitle>
              <CardDescription>{t.userResponsibilitiesDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-base">{t.forAllUsersTitle}</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                  {t.forAllUsersPoints.map((point, index) => <li key={index}>{point}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-base">{t.forDriversTitle}</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                  {t.forDriversPoints.map((point, index) => <li key={index}>{point}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-destructive">
                <AlertTriangle className="mr-2 h-6 w-6" />
                {t.disclaimerTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">{t.disclaimerParagraph1}</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                {t.disclaimerPoints.map((point, index) => <li key={index}>{point}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    