import { Drawer } from "./ui/drawer";
import { DrawerTrigger } from "./ui/drawer";
import { DrawerContent } from "./ui/drawer";
import { DrawerHeader } from "./ui/drawer";
import { DrawerTitle } from "./ui/drawer";
import { DrawerDescription } from "./ui/drawer";
import { DrawerFooter } from "./ui/drawer";
import { Button } from "./ui/button";
import { DrawerClose } from "./ui/drawer";
import React from "react";

const Storyboard8 = () => {
  return (
    <>
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you sure absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Storyboard8;
