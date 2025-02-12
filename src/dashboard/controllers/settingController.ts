import { Request, Response } from "express";
import Setting, { ISettings } from "../../models/settingModel.js";

export const getSetting = async (req: Request, res: Response) => {
  try {
    const rows: ISettings[] = await Setting.find();
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    // Construct update object with dot notation
    const updateFields: any = {};

    for (const key of Object.keys(updates)) {
      if (typeof updates[key] === "object" && updates[key] !== null) {
        for (const subKey of Object.keys(updates[key])) {
          updateFields[`${key}.${subKey}`] = updates[key][subKey];
        }
      } else {
        updateFields[key] = updates[key];
      }
    }

    const updatedSettings = await Setting.findOneAndUpdate(
      {},
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (updatedSettings) res.json(updatedSettings);
    else res.status(404).json({ message: "Settings not found" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
