import "./App.css";
import { Toaster } from "./components/ui/sonner";
import { RequestForm } from "./RequestForm";

function App() {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h1>API playground</h1>
      <div className="w-3/4 2xl:w-1/2">
        <RequestForm />
        <Toaster richColors position="top-center" />
      </div>
    </div>
  );
}

export default App;
