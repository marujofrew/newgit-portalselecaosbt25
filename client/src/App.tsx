import React, { useState, useEffect } from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ChatBot from "@/components/ChatBot";
import Home from "@/pages/home";
import Loading from "@/pages/loading";
import Cadastro from "@/pages/cadastro";
import Agendamento from "@/pages/agendamento";
import BoardingPassPreview from "@/pages/boarding-pass-preview";
import CartaoPreview from "@/pages/cartao-preview";
import ConfirmacaoInscricao from "@/pages/confirmacao-inscricao";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/loading" component={Loading}/>
      <Route path="/cadastro" component={Cadastro}/>
      <Route path="/agendamento" component={Agendamento}/>
      <Route path="/preview-cartao" component={BoardingPassPreview}/>
      <Route path="/cartao-preview" component={CartaoPreview}/>
      <Route path="/confirmacao-inscricao" component={ConfirmacaoInscricao}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showGlobalChatBot, setShowGlobalChatBot] = useState(false);
  const [userCity, setUserCity] = useState('');
  const [userData, setUserData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Verificar se chatbot deve aparecer globalmente
    const shouldShowChatBot = localStorage.getItem('showChatBotGlobal');
    const chatBotOpened = localStorage.getItem('chatBotOpened');
    
    if (shouldShowChatBot === 'true' && chatBotOpened === 'true') {
      setShowGlobalChatBot(true);
      
      // Carregar dados do usuário
      const storedUserCity = localStorage.getItem('userCity');
      const storedUserData = localStorage.getItem('responsavelData');
      const storedSelectedDate = localStorage.getItem('selectedDate');
      
      if (storedUserCity) setUserCity(storedUserCity);
      if (storedUserData) setUserData(JSON.parse(storedUserData));
      if (storedSelectedDate) setSelectedDate(storedSelectedDate);
    }
  }, []);
  
  // Estado do chatbot minimizado
  const [isChatBotMinimized, setIsChatBotMinimized] = useState(false);
  
  useEffect(() => {
    // Verificar se deve iniciar minimizado na página de cartões
    if (window.location.pathname.includes('cartao-preview')) {
      setIsChatBotMinimized(true);
      localStorage.setItem('chatBotMinimized', 'true');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        
        {/* ChatBot Global - aparece em todas as páginas após agendamento */}
        {showGlobalChatBot && (
          <ChatBot
            isOpen={showGlobalChatBot}
            onClose={() => {}} // Não pode ser fechado
            userCity={userCity}
            userData={userData}
            selectedDate={selectedDate}
            initialMinimized={isChatBotMinimized}
          />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
