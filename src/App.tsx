import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";

function App() {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h1>API playground</h1>
      <div className="w-3/4 2xl:w-1/2">
        <div className="flex flex-row justify-between mb-3">
          <div className="flex flex-row w-full">
            <Select>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="get">Get</SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="put">Put</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Input URL here" className="w-full max-w-[600px]"/>
          </div>
          <Button className="ml-3">Send</Button>
        </div>
        <Textarea placeholder="Request body" />
      </div>
    </div>
  );
}

export default App;
