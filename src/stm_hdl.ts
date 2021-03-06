// Copyright 2020 Carlos Alberto Ruiz Naranjo
//
// This file is part of magic-hdl-stm.
//
// magic-hdl-stm is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// magic-hdl-stm is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with magic-hdl-stm.  If not, see <https://www.gnu.org/licenses/>.

/* eslint-disable @typescript-eslint/class-name-casing */
export function get_hdl_code(language: string, type: string, stm): string {
  let stm_hdl: string = "";
  if (language === "vhdl") {
    let stm_vhdl = new Vhdl_code();
    stm_hdl = stm_vhdl.get_vhdl_code(type, stm);
  }
  else if (language === "verilog") {
    let stm_vhdl = new Verilog_code();
    stm_hdl = stm_vhdl.get_verilog_code(type, stm);
  }
  return stm_hdl;
}


class Vhdl_code {
  private indent: string = "  ";
  private indent2: string = this.indent + this.indent;
  private indent3: string = this.indent2 + this.indent;
  private indent4: string = this.indent3 + this.indent;


  get_vhdl_code(type: string, stm): string {
    let stm_hdl: string = "";
    if (type === "one_process") {
      stm_hdl = this.get_vhdl_one_process(stm);

    }
    return stm_hdl;
  }

  get_vhdl_one_process(stm): string {
    let stm_hdl: string = "";
    stm_hdl += this.open_process();
    stm_hdl += this.open_case();
    for (let i = 0; i < stm.length; ++i) {
      if (stm[i].transitions.length !== 0 || stm[i].outputs.length !== 0) {
        stm_hdl += this.open_when(stm[i].name);
        stm_hdl += this.add_outputs(stm[i].outputs);
        if (stm[i].transitions.length !== 0) {
          stm_hdl += this.generate_if_case(stm[i].transitions);
        }
      }
    }
    stm_hdl += this.close_case();
    stm_hdl += this.close_process();
    return stm_hdl;
  }

  open_when(state_name: string) {
    let str: string = "";
    str += this.indent2 + `when ${state_name} =>\n`;
    return str;
  }

  add_outputs(outputs) {
    let str: string = "";
    for (let i = 0; i < outputs.length; ++i) {
      let output = outputs[i];
      output = output.trim();
      if (output[output.length - 1] !== ';') {
        output += ';';
      }
      str += this.indent3 + `${output}\n`;
    }
    return str;
  }

  generate_if_case(transitions) {
    let str: string = "";
    for (let i = 0; i < transitions.length; ++i) {
      if (i === 0) {
        str += this.indent3 + `if (${transitions[i].condition}) then\n`;
        str += this.indent4 + `STATE <= ${transitions[i].destination};\n`;
      }
      else {
        str += this.indent3 + `elsif (${transitions[i].condition}) then\n`;
        str += this.indent4 + `STATE <= ${transitions[i].destination};\n`;
      }
    }
    str += this.indent3 + "end if;\n";
    return str;
  }

  open_process() {
    let str: string = "";
    str += "process(clk)\nbegin\n";
    return str;
  }

  close_process() {
    let str: string = "";
    str += "end process;\n";
    return str;
  }

  open_case() {
    let str: string = "";
    str += this.indent + "case STATE is\n";
    return str;
  }
  close_case() {
    let str: string = "";
    str += this.indent + "end case;\n";
    return str;
  }
}






class Verilog_code {
  private indent: string = "  ";
  private indent2: string = this.indent + this.indent;
  private indent3: string = this.indent2 + this.indent;
  private indent4: string = this.indent3 + this.indent;
  private indent5: string = this.indent4 + this.indent;
  private indent6: string = this.indent5 + this.indent;


  get_verilog_code(type: string, stm): string {
    let stm_hdl: string = "";
    if (type === "one_process") {
      stm_hdl = this.get_verilog_one_process(stm);

    }
    return stm_hdl;
  }

  get_verilog_one_process(stm): string {
    let stm_hdl: string = "";
    stm_hdl += this.open_process();
    stm_hdl += this.open_case();
    for (let i = 0; i < stm.length; ++i) {
      if (stm[i].transitions.length !== 0 || stm[i].outputs.length !== 0) {
        stm_hdl += this.open_when(stm[i].name);
        stm_hdl += this.add_outputs(stm[i].outputs);
        if (stm[i].transitions.length !== 0) {
          stm_hdl += this.generate_if_case(stm[i].transitions);
        }
        stm_hdl += this.close_when();
      }
    }
    stm_hdl += this.close_case();
    stm_hdl += this.close_process();
    return stm_hdl;
  }

  open_when(state_name: string) {
    let str: string = "";
    str += this.indent2 + `${state_name}:\n`;
    str += this.indent2 + `begin\n`;
    return str;
  }

  close_when() {
    let str: string = "";
    str += this.indent2 + `end\n`;
    return str;
  }

  add_outputs(outputs) {
    let str: string = "";
    for (let i = 0; i < outputs.length; ++i) {
      let output = outputs[i];
      output = output.trim();
      if (output[output.length - 1] !== ';') {
        output += ';';
      }
      str += this.indent3 + `${output}\n`;
    }
    return str;
  }

  generate_if_case(transitions) {
    let str: string = "";
    for (let i = 0; i < transitions.length; ++i) {
      if (i === 0) {
        str += this.indent3 + `if (${transitions[i].condition}) begin\n`;
        str += this.indent4 + `STATE = ${transitions[i].destination}\n`;
        str += this.indent3 + `end\n`;
      }
      else {
        str += this.indent3 + `if (${transitions[i].condition}) begin\n`;
        str += this.indent4 + `STATE = ${transitions[i].destination}\n`;
        str += this.indent3 + `end\n`;
      }
    }
    return str;
  }

  open_process() {
    let str: string = "";
    str += "always @(clk)\n";
    return str;
  }

  close_process() {
    let str: string = "";
    str += "end;\n";
    return str;
  }

  open_case() {
    let str: string = "";
    str += this.indent + "case(STATE):\n";
    return str;
  }
  close_case() {
    let str: string = "";
    str += this.indent + "endcase;\n";
    return str;
  }
}
