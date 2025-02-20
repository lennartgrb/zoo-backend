import { Hono } from "hono";
import { CompoundModel } from "../models/compounds.js";

export const compoundRouter = new Hono();

compoundRouter.get("/", async (c) => {
  try {
    //Logik
    const compounds = await CompoundModel.findAll();
    return c.json({
      data: compounds,
    });
  } catch (error) {
    console.log(error);
    c.json({
      error: "Oh Snap! Something went wrong!",
    });
  }
});

compoundRouter.get("/:id", async (c) => {
  try {
    //Logik
    const id = c.req.param("id");
    const compounds = await CompoundModel.findCompoundById(id);
    return c.json({
      data: compounds,
    });
  } catch (error) {
    console.log(error);
    c.json({
      error: "Oh Snap! Something went wrong!",
    });
  }
});

compoundRouter.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  try {
    const updatedCompound = await CompoundModel.updateCompound(id, body);

    if (updatedCompound) {
      return c.json({ message: "Compound updated succesfully", data: updatedCompound }, 200);
    } else {
      return c.text("Compound not found or update failed", 404);
    }
  } catch (error) {
    console.error("Error updating compound:", error);
    return c.text("Internal Server Error", 500);
  }
});

compoundRouter.post("/", async (c) => {
  const body = await c.req.json();

  try {
    const newCompound = await CompoundModel.createCompound(body);

    if (newCompound) {
      return c.json({ message: "Compound added succesfully", data: newCompound }, 200);
    } else {
      return c.text("Compound not found or adding failed", 404);
    }
  } catch (error) {
    console.error("Error adding compound:", error);
    return c.text("Internal Server Error", 500);
  }
});

compoundRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const deleteCompound = await CompoundModel.deleteCompound(id);

    if (deleteCompound) {
      return c.json({ message: "Compound deleted succesfully", data: deleteCompound }, 200);
    } else {
      return c.text("Compound not found or deleting failed", 404);
    }
  } catch (error) {
    console.error("Error deleting compound:", error);
    return c.text("Internal Server Error", 500);
  }
});

// compoundRouter.patch("/:id", async (c) => {
//   const id = c.req.param("id");

//   try {
//     const updateCompoundPart = await CompoundModel.updateCompoundParticial(id);

//     if (updateCompoundPart) {
//       return c.json({ message: "Compound deleted succesfully", data: updateCompoundPart }, 200);
//     } else {
//       return c.text("Compound not found or deleting failed", 404);
//     }
//   } catch (error) {
//     console.error("Error deleting compound:", error);
//     return c.text("Internal Server Error", 500);
//   }
// });
