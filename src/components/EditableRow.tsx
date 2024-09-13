"use client";
import React, { useState } from "react";

export default function EditableRow({
	placeholder,
	onInput,
	onEnterPress,
	className,
	id,
}: {
	placeholder: string;
	onInput?: (text: string) => void;
	onEnterPress?: () => void;
	className?: string;
	id?: string;
}) {
	return (
		<span
			suppressContentEditableWarning={true}
			id={id}
			onInput={(e) => {
				if (onInput) onInput(e.currentTarget.textContent ?? "");
			}}
			contentEditable="true"
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					if (onEnterPress) {
						onEnterPress();
						e.currentTarget.blur();
					}
				}
			}}
			className={
				"inline-block outline-none text-wrap input" +
				(className ? " " + className : "")
			}
			placeholder={placeholder}
		></span>
	);
}
