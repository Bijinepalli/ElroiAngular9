// #region [Imports]
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-ntilemodel',
  templateUrl: './ntilemodel.component.html',
  styleUrls: ['./ntilemodel.component.css']
})
// #endregion

export class NtilemodelComponent implements OnInit {

  // #region [Properties]

  // #region [Input/ Output Parameters]
  @Output() popUpClose = new EventEmitter();
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor() { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init - on page initilization
   */
  ngOnInit() {
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [btnSubmit_Click]
  /**
   * Btns submit click - Forms description and closes the model
   */
  btnSubmit_Click() {
    this.popUpClose.emit('s');
  }
  // #endregion

  // #region [btnClose_Click]
  /**
   * Btns close click - Closes model
   */
  btnClose_Click() {
    this.popUpClose.emit('close');
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #endregion
}
