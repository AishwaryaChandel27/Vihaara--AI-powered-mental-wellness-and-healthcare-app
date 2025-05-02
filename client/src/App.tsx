import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/SettingsContext";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Journal from "@/pages/Journal";
import Chat from "@/pages/Chat";
import Mood from "@/pages/Mood";
import About from "@/pages/About";
import Settings from "@/pages/Settings";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/journal" component={Journal} />
        <Route path="/chat" component={Chat} />
        <Route path="/mood" component={Mood} />
        <Route path="/about" component={About} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider>
          <Toaster />
          <Router />
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
