import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Loading from "@/pages/loading";
import Cadastro from "@/pages/cadastro";
import Agendamento from "@/pages/agendamento";
import BoardingPassPreview from "@/pages/boarding-pass-preview";
import CartaoPreview from "@/pages/cartao-preview";
import ConfirmacaoInscricao from "@/pages/confirmacao-inscricao";
import PixPayment from "@/pages/pix-payment";
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
      <Route path="/pix-payment" component={PixPayment}/>
      <Route path="/confirmacao-inscricao" component={ConfirmacaoInscricao}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
